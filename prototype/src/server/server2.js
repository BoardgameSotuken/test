const WebSocket = require('ws');
const fs = require('fs');

// WebSocketサーバーの設定
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('クライアントが接続しました');

  ws.on('message', (data) => {
    // 最初に受信するのはサイズ情報
    if (data.length === 4) {
      const size = data.readUInt32BE(0);  // データサイズの取得
      console.log(`受信したデータサイズ: ${size} バイト`);
    } else {
      // 画像データを受信
      fs.writeFileSync('received_frame.jpg', data);  // 画像を保存する例
      console.log('フレームデータを受信しました');
    }
  });

  ws.on('close', () => {
    console.log('クライアントが切断しました');
  });
});

console.log('WebSocketサーバーがポート5000で待機中...');