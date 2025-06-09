import json
import time
import logger
import threading

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


def period_log():
    while True:
        if logger.is_logging:
            logger.insert_temperature(robotVacuum)
            logger.insert_temperature(robotGripper)
            print('Залогировано')
        else:
            print('Не залогировано')
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
