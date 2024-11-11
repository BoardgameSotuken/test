import cv2
import cv2.aruco as aruco
import websocket
import json
import time
import os

class Main:

    def __init__(self, playerID):
        self.playerID = playerID
        self.arucoids = None

    def Aruco_reading(self):
        # プログレスバー用カウント(1メモリ0.05秒)
        cnt = 0
        # カメラを初期化
        cap = cv2.VideoCapture(0)
        # コンソール画面の初期化
        os.system('clear')
        aruco_dict = aruco.getPredefinedDictionary(aruco.DICT_4X4_250)
        # Aruco辞書を取得
        parameters = aruco.DetectorParameters()

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            # マーカーを検出
            detecter = aruco.ArucoDetector(aruco_dict, parameters)
            corners, ids, rejectedImgPoints = detecter.detectMarkers(frame)

            if ids is not None:
                countber = ""
                # 最初のマーカーIDを取得
                for i in range(1, cnt + 1):
                    countber += "="

                marker_id = int(ids[0][0])
                print("\033[2A")
                print(f'Detected marker ID: {marker_id:<4}\nCount : [{countber:<19}]', end='')
                cnt += 1
                if cnt == 20:
                    print('\nreading!')
                    self.data_sending(marker_id)
            else:
                cnt = 0
            # マーカーをフレームに描画
            aruco.drawDetectedMarkers(frame, corners, ids)
            # フレームを表示
            cv2.imshow('Aruco Marker Detection', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            
            time.sleep(0.05)

        cap.release()
        cv2.destroyAllWindows()

    def data_sending(self, marker_id):
        ws_url = 'ws://172.16.2.125:8080'  # WebSocketサーバーのURL

        try:
            # WebSocket接続を作成
            ws = websocket.create_connection(ws_url)

            # データを送信するためのペイロードを作成
            data = {'type': 'arco', 'marker_id': marker_id}
            ws.send(json.dumps(data))  # データをJSON形式に変換して送信
            
            # 接続を閉じる
            ws.close()

        except Exception as e:
            print(f'Error! {e}')

if __name__ == "__main__":
    a = Main('pyaer1')
    a.Aruco_reading()
