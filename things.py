import abc
import json


class Calibration:
    @staticmethod
    def calibrate_encoder_ax(value):
        """Калибровка энкодера серии AX (0..1024)"""
        if value == -1:  # Ошибка чтения
            return None
        return (value * 360) / 1024  # Преобразуем в градусы

    @staticmethod
    def calibrate_encoder_mx(value):
        """Калибровка энкодера серии MX (0..4096)"""
        if value == -1:  # Ошибка чтения
            return None
        return (value * 360) / 4096  # Преобразуем в градусы

    @staticmethod
    def calibrate_temperature(value):
        """Калибровка температуры (0..100)"""
        if value == -1:  # Ошибка чтения
            return None
        return value  # Температура уже в градусах Цельсия

    @staticmethod
    def calibrate_load(value):
        """Калибровка нагрузки (0..2048 -> 0..100%)"""
        if value == -1:  # Ошибка чтения
            return None
        if value > 1023:
            # Отрицательная нагрузка (против часовой стрелки)
            return -((value - 1024) * 100) / 1024
        else:
            # Положительная нагрузка (по часовой стрелке)
            return (value * 100) / 1024


class Robot(abc.ABC):
    def __init__(self):
        print('Create robot')
        self.n = 0
        self.s = 0
        self.c = 0
        self.t1 = 0
        self.t2 = 0
        self.t3 = 0
        self.t4 = 0
        self.t5 = 0
        self.t6 = 0
        self.m1 = 0
        self.m2 = 0
        self.m3 = 0
        self.m4 = 0
        self.m5 = 0
        self.m6 = 0
        self.l1 = 0
        self.l2 = 0
        self.l3 = 0
        self.l4 = 0
        self.l5 = 0
        self.l6 = 0

        self.N = 0
        self.X = 0
        self.Y = 0

    def get_calibrated_data(self):
        """Получение калиброванных данных"""
        return {
            'temperatures': {
                't1': Calibration.calibrate_temperature(self.t1),
                't2': Calibration.calibrate_temperature(self.t2),
                't3': Calibration.calibrate_temperature(self.t3),
                't4': Calibration.calibrate_temperature(self.t4),
                't5': Calibration.calibrate_temperature(self.t5),
                't6': Calibration.calibrate_temperature(self.t6)
            },
            'loads': {
                'l1': Calibration.calibrate_load(self.l1),
                'l2': Calibration.calibrate_load(self.l2),
                'l3': Calibration.calibrate_load(self.l3),
                'l4': Calibration.calibrate_load(self.l4),
                'l5': Calibration.calibrate_load(self.l5),
                'l6': Calibration.calibrate_load(self.l6)
            }
        }


class RobotVacuum(Robot):
    def __init__(self):
        super().__init__()
        self.V = 0
        self.name = 'Robot_Vacuum'

    def connect(self, request):
        try:
            self.n = int(request.args.get('n', '0'))
            self.s = int(request.args.get('s', '0'))
            self.c = int(request.args.get('c', '0'))
            self.t1 = int(request.args.get('t1', '0'))
            self.t2 = int(request.args.get('t2', '0'))
            self.t3 = int(request.args.get('t3', '0'))
            self.t4 = int(request.args.get('t4', '0'))
            self.t5 = int(request.args.get('t5', '0'))
            self.t6 = int(request.args.get('t6', '0'))
            self.m1 = int(request.args.get('m1', '0'))
            self.m2 = int(request.args.get('m2', '0'))
            self.m3 = int(request.args.get('m3', '0'))
            self.m4 = int(request.args.get('m4', '0'))
            self.m5 = int(request.args.get('m5', '0'))
            self.m6 = int(request.args.get('m6', '0'))
            self.l1 = int(request.args.get('l1', '0'))
            self.l2 = int(request.args.get('l2', '0'))
            self.l3 = int(request.args.get('l3', '0'))
            self.l4 = int(request.args.get('l4', '0'))
            self.l5 = int(request.args.get('l5', '0'))
            self.l6 = int(request.args.get('l6', '0'))
        except ValueError:
            # В случае ошибки преобразования, устанавливаем значение -1 (ошибка чтения)
            self.n = -1
            self.s = -1
            self.c = -1
            self.t1 = -1
            self.t2 = -1
            self.t3 = -1
            self.t4 = -1
            self.t5 = -1
            self.t6 = -1
            self.m1 = -1
            self.m2 = -1
            self.m3 = -1
            self.m4 = -1
            self.m5 = -1
            self.m6 = -1
            self.l1 = -1
            self.l2 = -1
            self.l3 = -1
            self.l4 = -1
            self.l5 = -1
            self.l6 = -1

        return json.dumps({
            'N': self.N,
            'X': self.X,
            'Y': self.Y,
            'V': self.V
        })

    def get_properties(self):
        raw_data = {
            't1': self.t1,
            't2': self.t2,
            't3': self.t3,
            't4': self.t4,
            't5': self.t5,
            't6': self.t6,
            'm1': self.m1,
            'm2': self.m2,
            'm3': self.m3,
            'm4': self.m4,
            'm5': self.m5,
            'm6': self.m6,
            'l1': self.l1,
            'l2': self.l2,
            'l3': self.l3,
            'l4': self.l4,
            'l5': self.l5,
            'l6': self.l6,
            's': self.s,
            'c': self.c,
            'n': self.n
        }

        # Добавляем калиброванные данные
        calibrated_data = self.get_calibrated_data()
        raw_data['calibrated'] = calibrated_data

        return json.dumps(raw_data)

    def set_properties(self, request):
        self.N = request.args.get('N_control_2', '')
        self.X = request.args.get('X_2', '')
        self.Y = request.args.get('Y_2', '')
        self.V = request.args.get('V_2', '')

        return json.dumps({'response': 0})


class RobotGripper(Robot):
    def __init__(self):
        super().__init__()
        self.T = 0
        self.G = 0
        self.name = 'Robot_Gripper'

    def connect(self, request):
        try:
            self.n = int(request.args.get('n', '0'))
            self.s = int(request.args.get('s', '0'))
            self.c = int(request.args.get('c', '0'))
            self.t1 = int(request.args.get('t1', '0'))
            self.t2 = int(request.args.get('t2', '0'))
            self.t3 = int(request.args.get('t3', '0'))
            self.t4 = int(request.args.get('t4', '0'))
            self.t5 = int(request.args.get('t5', '0'))
            self.t6 = int(request.args.get('t6', '0'))
            self.m1 = int(request.args.get('m1', '0'))
            self.m2 = int(request.args.get('m2', '0'))
            self.m3 = int(request.args.get('m3', '0'))
            self.m4 = int(request.args.get('m4', '0'))
            self.m5 = int(request.args.get('m5', '0'))
            self.m6 = int(request.args.get('m6', '0'))
            self.l1 = int(request.args.get('l1', '0'))
            self.l2 = int(request.args.get('l2', '0'))
            self.l3 = int(request.args.get('l3', '0'))
            self.l4 = int(request.args.get('l4', '0'))
            self.l5 = int(request.args.get('l5', '0'))
            self.l6 = int(request.args.get('l6', '0'))
        except ValueError:
            # В случае ошибки преобразования, устанавливаем значение -1 (ошибка чтения)
            self.n = -1
            self.s = -1
            self.c = -1
            self.t1 = -1
            self.t2 = -1
            self.t3 = -1
            self.t4 = -1
            self.t5 = -1
            self.t6 = -1
            self.m1 = -1
            self.m2 = -1
            self.m3 = -1
            self.m4 = -1
            self.m5 = -1
            self.m6 = -1
            self.l1 = -1
            self.l2 = -1
            self.l3 = -1
            self.l4 = -1
            self.l5 = -1
            self.l6 = -1

        return json.dumps({
            'N': self.N,
            'X': self.X,
            'Y': self.Y,
            'T': self.T,
            'G': self.G
        })

    def get_properties(self):
        raw_data = {
            't1': self.t1,
            't2': self.t2,
            't3': self.t3,
            't4': self.t4,
            't5': self.t5,
            't6': self.t6,
            'm1': self.m1,
            'm2': self.m2,
            'm3': self.m3,
            'm4': self.m4,
            'm5': self.m5,
            'm6': self.m6,
            'l1': self.l1,
            'l2': self.l2,
            'l3': self.l3,
            'l4': self.l4,
            'l5': self.l5,
            'l6': self.l6,
            's': self.s,
            'c': self.c,
            'n': self.n
        }

        # Добавляем калиброванные данные
        calibrated_data = self.get_calibrated_data()
        raw_data['calibrated'] = calibrated_data

        return json.dumps(raw_data)

    def set_properties(self, request):
        self.N = request.args.get('N_control_1', '')
        self.X = request.args.get('X_1', '')
        self.Y = request.args.get('Y_1', '')
        self.T = request.args.get('T_1', '')
        self.G = request.args.get('G_1', '')

        return json.dumps({'response': 0})


class TrafficLights:
    def __init__(self):
        self.L1 = 0
        self.L2 = 0
        self.L3 = 0
        self.L4 = 0

    def connect(self):
        return json.dumps({
            'L1': self.L1,
            'L2': self.L2,
            'L3': self.L3,
            'L4': self.L4
        })

    def set_properties(self, request):
        self.L1 = request.args.get('L1', '')
        self.L2 = request.args.get('L2', '')
        self.L3 = request.args.get('L3', '')
        self.L4 = request.args.get('L4', '')

        return json.dumps({'response': 0})


class SmartCamera:
    def __init__(self):
        self.code = 0

    def connect(self, request):
        self.code = request.args.get('code', '')

        return json.dumps({'response': 0})

    def get_properties(self):
        return json.dumps({
            'code': self.code
        })


class RemoteTerminal:
    def __init__(self):
        self.p = 0
        self.b1 = 0
        self.b2 = 0
        self.b3 = 0

        self.L1 = 1
        self.L2 = 0
        self.L3 = 0
        self.L4 = 0

    def connect(self, request):
        self.p = request.args.get('p', '')
        self.b1 = request.args.get('b1', '')
        self.b2 = request.args.get('b2', '')
        self.b3 = request.args.get('b3', '')

        return json.dumps({
            'L1': self.L1,
            'L2': self.L2,
            'L3': self.L3,
            'L4': self.L4
        })

    def set_properties(self, request):
        self.L1 = request.args.get('L1', '')
        self.L2 = request.args.get('L2', '')
        self.L3 = request.args.get('L3', '')
        self.L4 = request.args.get('L4', '')

        return json.dumps({'response': 0})
