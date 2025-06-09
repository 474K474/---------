import json
import time
import logger
import threading
import datetime

from flask import Flask, render_template, request
from things import *


app = Flask(__name__)
robotGripper = RobotGripper()
robotVacuum = RobotVacuum()
remoteTerminal = RemoteTerminal()
trafficLights = TrafficLights()
smartCamera = SmartCamera()

logger = logger.Logger('examDB')


@app.route('/is_logged')
def is_logged():
    logger.is_logging = bool(request.args.get('isLooged', ''))
    print('Данные пришли')
    return json.dumps({'response': 'OK'})


def check_critical_states():
    # Проверка температуры роботов
    for robot in [robotVacuum, robotGripper]:
        for i in range(1, 7):
            temp = getattr(robot, f't{i}')
            if temp > 65:  # Критическая температура
                logger.insert_critical_state(
                    robot.name,
                    f'temperature_{i}',
                    temp,
                    65,
                    f'Critical temperature on motor {i}'
                )
            elif temp > 50:  # Предупреждение
                logger.insert_critical_state(
                    robot.name,
                    f'temperature_{i}',
                    temp,
                    50,
                    f'High temperature warning on motor {i}'
                )

        # Проверка нагрузки на сервоприводы
        for i in range(1, 7):
            load = getattr(robot, f'l{i}')
            if load > 90:  # Критическая нагрузка
                logger.insert_critical_state(
                    robot.name,
                    f'load_{i}',
                    load,
                    90,
                    f'Critical load on motor {i}'
                )


def period_log():
    while True:
        if logger.is_logging:
            # Логируем температуру и состояние роботов
            for robot in [robotVacuum, robotGripper]:
                logger.insert_temperature(robot)
                logger.insert_robot_state(robot)
            
            # Логируем состояние камеры
            logger.insert_camera_state(smartCamera)
            
            # Логируем состояние сигнальных ламп
            logger.insert_traffic_lights_state(trafficLights)
            
            # Логируем состояние удаленного терминала
            logger.insert_remote_terminal_state(remoteTerminal)
            
            # Проверяем критические состояния
            check_critical_states()
            
            # Очищаем старые данные каждые 24 часа
            current_hour = datetime.datetime.now().hour
            if current_hour == 0:  # В полночь
                logger.clear_old_data(days=30)
                
            print('Данные сохранены в БД')
        else:
            print('Логирование отключено')
        time.sleep(5)


thread = threading.Thread(target=period_log)
thread.daemon = True
thread.start()


@app.route('/set_traffic_lights_data')
def set_traffic_lights_data():
    return trafficLights.set_properties(request)


@app.route('/set_remote_terminal_data')
def set_remote_terminal_data():
    return remoteTerminal.set_properties(request)


@app.route('/set_gripper_data')
def set_gripper_data():
    return robotGripper.set_properties(request)


@app.route('/set_vacuum_data')
def set_vacuum_data():
    return robotVacuum.set_properties(request)


@app.route('/get_code')
def get_code():
    return smartCamera.get_properties()


@app.route('/get_vacuum_data')
def get_vacuum_data():
    return robotVacuum.get_properties()


@app.route('/get_gripper_data')
def get_gripper_data():
    return robotGripper.get_properties()


@app.route('/robot_gripper_connect')
def robot_gripper_connect():
    return robotGripper.connect(request)


@app.route('/robot_vacuum_connect')
def robot_vacuum_connect():
    return robotVacuum.connect(request)


@app.route('/remote_terminal_connect')
def remote_terminal_connect():
    return remoteTerminal.connect(request)


@app.route('/traffic_lights_connect')
def traffic_lights_connect():
    return trafficLights.connect()


@app.route('/smart_camera_connect')
def smart_camera_connect():
    return smartCamera.connect(request)


@app.route('/get_poi_names')
def get_poi_names():
    # Здесь можно хранить точки интереса в словаре или базе данных
    poi_points = {
        'P': {'name': 'Parking', 'x': 180, 'y': 0},
        'H': {'name': 'Home', 'x': 180, 'y': 180},
        'W': {'name': 'Work', 'x': 0, 'y': 180}
    }
    return json.dumps(poi_points)


@app.route('/set_remote_terminal_color')
def set_remote_terminal_color():
    blue = request.args.get('blue', '0')
    red = request.args.get('red', '0')
    yellow = request.args.get('yellow', '0')
    green = request.args.get('green', '0')
    
    remoteTerminal.L1 = int(blue)
    remoteTerminal.L2 = int(red)
    remoteTerminal.L3 = int(yellow)
    remoteTerminal.L4 = int(green)
    
    return json.dumps({'response': 'OK'})


@app.route('/')
def hello_world():  # put application's code here
    return render_template('emulator.html')


@app.route('/engineer_interface')
def engineer_interface():
    return render_template('egeneer_interface.html')


@app.route('/operator_interface')
def operator_interface():
    return render_template('operator_interface.html')


if __name__ == '__main__':
    app.run()
