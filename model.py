from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import torch
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from io import StringIO, BytesIO
import os

app = Flask(__name__)
CORS(app)

model = SentenceTransformer('all-MiniLM-L6-v2')
model.max_seq_length = 384

import requests

url_csv = "https://storage.googleapis.com/cinemood/Overall%20Movie.csv"
response_csv = requests.get(url_csv)
data = StringIO(response_csv.text)
dataset = pd.read_csv(data)

tensors = torch.load('Overall Movies.pt')
tensors = tensors.half()

@app.route("/find_similarity/", methods=['POST', 'OPTIONS'])
@cross_origin(options=None)

def find_similarity():
    item = request.get_json()
    input = item['input'].lower()
    input = input.replace("[^a-zA-Z#]", " ")
    embeddings1 = model.encode(input, convert_to_tensor=True)

    batch_size = 1000
    num_batches = len(tensors) // batch_size

    results = []
    for i in range(num_batches):
        batch_tensors = tensors[i*batch_size: (i+1)*batch_size]
        cosine_scores = util.pytorch_cos_sim(embeddings1, batch_tensors)
        top_results = torch.topk(cosine_scores, k=30)
        top_indices = top_results[1][0]
        top_scores = top_results[0][0]
        
        for i in range(30):
            results.append({
                'movie': dataset['Movie Name'][top_indices[i].item()],
                'score': float(top_scores[i].item()),
                'year': dataset['Year of Release'][top_indices[i].item()],
                'rating': dataset['Movie Rating'][top_indices[i].item()]
            })
            
    return jsonify({'results': results})

if __name__ == '__main__':
    # Check if running on Heroku or locally
    if 'DYNO' in os.environ:
        # Running on Heroku
        port = int(os.environ.get('PORT', 5000))
    else:
        # Running locally
        port = 3000
    
    app.run(port=port)

