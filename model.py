from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from sentence_transformers import SentenceTransformer, util
import torch
import pandas as pd
from io import StringIO
import os
import requests
from celery import Celery
import redis

app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)

# configure Celery
celery = Celery(app.name, broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'))
celery.conf.update(app.config)

@app.route('/')
def serve():
        return app.send_static_file('index.html')

model = SentenceTransformer('paraphrase-MiniLM-L3-v2')

import requests

url_csv = "https://storage.googleapis.com/cinemood/Overall%20Movie.csv"
response_csv = requests.get(url_csv)
data = StringIO(response_csv.text)
dataset = pd.read_csv(data)

tensors = torch.load('Overall Movie.pt')

@celery.task(bind=True)
def compute_similarity(self, input):
    input = input.replace("[^a-zA-Z#]", " ")
    embeddings1 = model.encode(input, convert_to_tensor=True)
    cosine_scores = util.pytorch_cos_sim(embeddings1, tensors)
    top_results = torch.topk(cosine_scores, k=20)
    top_indices = top_results[1][0]
    top_scores = top_results[0][0]

    results = []
    for i in range(20):
        results.append({
            'movie': dataset['Movie Name'][top_indices[i].item()],
            'score': float(top_scores[i].item()),
            'year': dataset['Year of Release'][top_indices[i].item()],
            'rating': dataset['Movie Rating'][top_indices[i].item()]
        })
    return results

@app.route("/find_similarity/", methods=['POST', 'OPTIONS'])
@cross_origin(options=None)
def find_similarity():
    item = request.get_json()
    input = item['input'].lower()
    result = compute_similarity.delay(input)
    return jsonify({'task_id': str(result.id), 'status': 'Processing'})

@app.route("/results/<task_id>", methods=['GET'])
def get_results(task_id):
    task = compute_similarity.AsyncResult(task_id)
    if task.state == 'SUCCESS':
        return jsonify({'status': 'SUCCESS', 'results': task.result})
    return jsonify({'status': task.state})

if __name__ == '__main__':
    # Check if running on Heroku or locally
    if 'DYNO' in os.environ:
        # Running on Heroku
        port = int(os.environ.get('PORT', 5000))
    else:
        # Running locally
        port = 3000
    
    app.run(port=port)