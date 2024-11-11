import cv2
import cv2.aruco as aruco
import websocket
import json
import time
import os
import numpy as np
import matplotlib.pyplot as plt




class Main:

    def __init__(self, capture_mode):
        self.capture_mode = capture_mode
        self.arucoids = None


    def Aruco_reading(self):
        # プログレスバー用カウント(1メモリ0.05秒)
        cnt = 0
        cap = cv2.VideoCapture(0)
        # コンソール画面の初期化
        aruco_dict = aruco.getPredefinedDictionary(aruco.DICT_6X6_250)
        # Aruco辞書を取得
        parameters = aruco.DetectorParameters()
        # Aruco取得モード
        start_pos = None
        goal_pos = None

        start_goal_check = True

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            # マーカーを検出
            detecter = aruco.ArucoDetector(aruco_dict, parameters)
            corners, ids, rejectedImgPoints = detecter.detectMarkers(frame)


            if self.capture_mode == 2:
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
                        if cv2.waitKey(1) & 0xFF == ord('p'):
                            # self.next_point(markers_id_pos)
                            #self.plot_point(markers_id_pos) 
                            self.make_map(markers_id_pos) 

            # マーカーをフレームに描画
            aruco.drawDetectedMarkers(frame, corners, ids)
            # フレームを表示
            cv2.imshow('Aruco Marker Detection', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                print(f"28:{start_pos},29:{goal_pos}")
                break
            
            time.sleep(0.02)

        cap.release()
        cv2.destroyAllWindows()

    def plot_point(self,marker_id_point):

        fig = plt.figure()
        plt.clf()
        
        #図の幅をカメラの解像度に合わせる
        plt.xlim(0,640)
        plt.ylim(0,480)

        for id,pos_x,pos_y in marker_id_point:

            plt.plot(pos_x,pos_y,lw=0,marker='o') if id ==28 or id == 29 else plt.plot(pos_x,pos_y,lw=0,marker='.')
            plt.text(pos_x,pos_y-20,f"{int(id)}")
        
        plt.gca().invert_yaxis()
        plt.show()

    def make_map(self, marker_id_point):
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
            next_marker_index = self.find_nearest_id(map_list[-1], marker_id_pos)
            map_list.append(marker_id_pos[next_marker_index])
            marker_id_pos = np.delete(marker_id_pos, next_marker_index, axis=0)  # 配列から削除して再代入
        

        #map_listから[0]の要素のみ取り出した新しい配列を作成
        map_id_list = [item[0] for item in map_list]

        print(map_id_list)
        return map_id_list


    def find_nearest_id(self, reference_id, marker_id_point):
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




if __name__ == "__main__":

    # Main(モード番号)

    '''
    
    Main Mode 1

        単体モード

        役職決めなどの一枚使用時のモード
    
    Main Mode 2

        すごろくマッピング用モード

    '''
        
    a = Main(2)
    a.Aruco_reading()