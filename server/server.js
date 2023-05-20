const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000; // Specify the port you want to run your server on

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@55w0rd",
    database: "signup"
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (email,password) VALUES (?, ?)";
    const values = [
        req.body.email,
        req.body
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if(data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Failed");
        }
    })
})

app.listen(3000, () => {
    console.log("Server listening")
})