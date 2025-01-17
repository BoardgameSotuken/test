

const settings = require("./settings.js");
const express = require('express');
const app = express();
const cors = require('cors');

// CORSを許可
app.use(cors());

// JSON形式のデータを処理するためのミドルウェア
app.use(express.json());

let count = 0;

// クライアントからのPOSTリクエストを処理
//.post(送信先URL,送信データ)
app.post('/api', function(req, res) {
    const clientData = req.body.number;
    count = count + clientData +1;

    // サーバー側からの応答を送信
    res.json({ reply: count });
});

app.listen(settings.port, settings.host);
console.log("server listen...");