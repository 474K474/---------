import abc
import json


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


class RobotVacuum(Robot):
    def __init__(self):
        super().__init__()
        self.V = 0
        self.name = 'Robot_Vacuum'

    def connect(self, request):
        self.n = int(request.args.get('n', ''))
        self.s = int(request.args.get('s', ''))
        self.c = int(request.args.get('c', ''))
        self.t1 = int(request.args.get('t1', ''))
        self.t2 = int(request.args.get('t2', ''))
        self.t3 = int(request.args.get('t3', ''))
        self.t4 = int(request.args.get('t4', ''))
        self.t5 = int(request.args.get('t5', ''))
        self.t6 = int(request.args.get('t6', ''))
        self.m1 = int(request.args.get('m1', ''))
        self.m2 = int(request.args.get('m2', ''))
        self.m3 = int(request.args.get('m3', ''))
        self.m4 = int(request.args.get('m4', ''))
        self.m5 = int(request.args.get('m5', ''))
        self.m6 = int(request.args.get('m6', ''))
        self.l1 = int(request.args.get('l1', ''))
        self.l2 = int(request.args.get('l2', ''))
        self.l3 = int(request.args.get('l3', ''))
        self.l4 = int(request.args.get('l4', ''))
        self.l5 = int(request.args.get('l5', ''))
        self.l6 = int(request.args.get('l6', ''))

        return json.dumps({
            'N': self.N,
            'X': self.X,
            'Y': self.Y,
            'V': self.V
        })

    def get_properties(self):
        return json.dumps({
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

        })

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
        self.n = int(request.args.get('n', ''))
        self.s = int(request.args.get('s', ''))
        self.c = int(request.args.get('c', ''))
        self.t1 = int(request.args.get('t1', ''))
        self.t2 = int(request.args.get('t2', ''))
        self.t3 = int(request.args.get('t3', ''))
        self.t4 = int(request.args.get('t4', ''))
        self.t5 = int(request.args.get('t5', ''))
        self.t6 = int(request.args.get('t6', ''))
        self.m1 = int(request.args.get('m1', ''))
        self.m2 = int(request.args.get('m2', ''))
        self.m3 = int(request.args.get('m3', ''))
        self.m4 = int(request.args.get('m4', ''))
        self.m5 = int(request.args.get('m5', ''))
        self.m6 = int(request.args.get('m6', ''))
        self.l1 = int(request.args.get('l1', ''))
        self.l2 = int(request.args.get('l2', ''))
        self.l3 = int(request.args.get('l3', ''))
        self.l4 = int(request.args.get('l4', ''))
        self.l5 = int(request.args.get('l5', ''))
        self.l6 = int(request.args.get('l6', ''))

        return json.dumps({
            'N': self.N,
            'X': self.X,
            'Y': self.Y,
            'T': self.T,
            'G': self.G
        })

    def get_properties(self):
        return json.dumps({
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

        })

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
