import cv2
import cv2.aruco as aruco
import asyncio
import websockets
import numpy as np
import base64
import json

# WebSocketサーバーのホストとポート
HOST = 'ws://localhost:8080'  # WebSocket URL

async def send_video():
    
    # カメラの準備
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)

    parameters = aruco.DetectorParameters()

    data_sending = None
    start_goal_check = True
    list_data = None

    # WebSocketサーバーに接続
    try:
        async with websockets.connect(HOST) as websocket:
            while True:
                # 1フレーム分のデータを取得
                ret, frame = cap.read()
                if not ret:
                    print("カメラからフレームを取得できませんでした。")
                    break

                kernel = 100
                kernel = kernel*2+1
                para_C = 5

                gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                #gray_frame = cv2.adaptiveThreshold(gray_frame, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, kernel, para_C)

                detecter = aruco.ArucoDetector(aruco.getPredefinedDictionary(aruco.DICT_6X6_250), parameters)
                corners, ids, rejectedImgPoints = detecter.detectMarkers(gray_frame)

                if ids is not None:
                    if start_goal_check:
                            
                        start_pos = None 
                        goal_pos = None
                        
                        for marker_id, marker_pos in zip(ids,corners):

                            #print(marker_id,marker_pos)

                            if marker_id == 28:
                                start_pos = marker_pos

                            if marker_id == 29:
                                goal_pos = marker_pos

                            if start_pos is not None and goal_pos is not None:
                                start_goal_check = False
                                break
                    
                    else:
                        
                        np_ids = np.reshape(np.array(ids),(len(ids),1,1))
                        np_pos = ((np.array(corners))[:,:,0])

                        markers_id_pos = np.squeeze((np.concatenate([np_ids,np_pos],axis=2)),1)
                        #print(markers_id_pos)
                        if responce == "set":
                            print('get')
                            make_map_list = make_map(markers_id_pos) 
                            list_data = np.array([row for num in make_map_list for row in markers_id_pos if row[0] == num]).tolist()
                            print('send')
                            print(list_data)
    

                # マーカーをフレームに描画
                aruco.drawDetectedMarkers(frame, corners, ids)
                
                # フレームをJPEG形式にエンコード
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
                result, frame_data = cv2.imencode('.jpg', frame, encode_param)
                frame_data = base64.b64encode(frame_data).decode('utf-8')

                if not result:
                    print("JPEGエンコード失敗")
                    continue

                message = json.dumps({
                    "tag": "image",
                    "data": {"frame": frame_data,
                             "list": list_data
                            }
                })

                await websocket.send(message)  # 画像データを送信
                responce = await websocket.recv() 
                #print(responce)        

    except websockets.exceptions.ConnectionClosedError as e:
        print(f"Connection closed: {e}")
        # 再接続処理
        await asyncio.sleep(1)
        await send_video()
    # カメラをリリース
    cap.release()

def make_map(marker_id_point):
    marker_id_pos = np.array(marker_id_point)
    map_list = list()
    index_28 = None
    # ID28の取得
    for index, marker in enumerate(marker_id_pos):
        if marker[0] == 28:
            index_28 = index
            break

    # リストの先頭に28を追加し、配列から削除
    if index_28 is not None:
        map_list.append(marker_id_pos[index_28])
        marker_id_pos = np.delete(marker_id_pos, index_28, axis=0)  # 配列から削除して再代入

    while len(marker_id_pos) > 0:  # まだマーカーが残っている限り繰り返す
        
        if len(map_list) > 0:
            next_marker_index = find_nearest_id(map_list[-1], marker_id_pos)
        else:
            # map_listが空の場合、最初のマーカーを取得
            next_marker_index = 0

        if next_marker_index is None:  # 最も近いマーカーが見つからなかった場合の処理
            print("次のマーカーが見つかりませんでした")
            break

        map_list.append(marker_id_pos[next_marker_index])
        marker_id_pos = np.delete(marker_id_pos, next_marker_index, axis=0)  # 配列から削除して再代入
    

    #map_listから[0]の要素のみ取り出した新しい配列を作成
    map_id_list = [int(item[0]) for item in map_list]

    return map_id_list


def find_nearest_id(reference_id, marker_id_point):
    reference_id_position = np.array([reference_id[1], reference_id[2]])
    min_distance = float('inf')
    nearest_marker = None
    nearest_marker_index = None

    for marker in marker_id_point:
        if marker[0] != reference_id[0]:
            position = np.array([marker[1], marker[2]])
            distance = np.linalg.norm(reference_id_position - position)
            if distance < min_distance:
                min_distance = distance
                nearest_marker = marker

    for index, marker in enumerate(marker_id_point):
        if marker[0] == nearest_marker[0]: 
            nearest_marker_index = index
            break

    return nearest_marker_index

# 非同期で動画を送信
asyncio.run(send_video())