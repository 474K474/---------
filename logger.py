import pymongo
import datetime


class Logger:
    def __init__(self, db_name):
        self.is_logging = True
        try:
            self.client = pymongo.MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000)
            # Проверка подключения
            self.client.server_info()
            print("Successfully connected to MongoDB")
            self.db = self.client[db_name]
        except pymongo.errors.ServerSelectionTimeoutError:
            print("Failed to connect to MongoDB. Make sure MongoDB is running.")
            self.client = None
            self.db = None

    def insert_temperature(self, robot):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'robotName': robot.name,
            't1': robot.t1,
            't2': robot.t2,
            't3': robot.t3,
            't4': robot.t4,
            't5': robot.t5,
            't6': robot.t6
        }
        return self.db[robot.name+'_temperature'].insert_one(result)

    def insert_robot_state(self, robot):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'robotName': robot.name,
            'status': robot.s,
            'counter': robot.c,
            'motors': {
                'm1': robot.m1, 'm2': robot.m2, 'm3': robot.m3,
                'm4': robot.m4, 'm5': robot.m5, 'm6': robot.m6
            },
            'loads': {
                'l1': robot.l1, 'l2': robot.l2, 'l3': robot.l3,
                'l4': robot.l4, 'l5': robot.l5, 'l6': robot.l6
            }
        }
        return self.db[robot.name+'_state'].insert_one(result)

    def insert_camera_state(self, camera):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'code': camera.code
        }
        return self.db['smart_camera'].insert_one(result)

    def insert_traffic_lights_state(self, lights):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'blue': lights.L1,
            'red': lights.L2,
            'yellow': lights.L3,
            'green': lights.L4
        }
        return self.db['traffic_lights'].insert_one(result)

    def insert_remote_terminal_state(self, terminal):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'switch': terminal.p,
            'button1': terminal.b1,
            'button2': terminal.b2,
            'button3': terminal.b3,
            'indicators': {
                'blue': terminal.L1,
                'red': terminal.L2,
                'yellow': terminal.L3,
                'green': terminal.L4
            }
        }
        return self.db['remote_terminal'].insert_one(result)

    def insert_critical_state(self, device_name, parameter, value, threshold, message):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'deviceName': device_name,
            'parameter': parameter,
            'value': value,
            'threshold': threshold,
            'message': message
        }
        return self.db['critical_states'].insert_one(result)

    def get_temperature_history(self, robot_name, limit=100):
        if self.db is None:
            print("Database connection not available")
            return []
            
        collection = self.db[robot_name+'_temperature']
        return list(collection.find().sort('timeStamp', -1).limit(limit))

    def get_state_history(self, robot_name, limit=100):
        if self.db is None:
            print("Database connection not available")
            return []
            
        collection = self.db[robot_name+'_state']
        return list(collection.find().sort('timeStamp', -1).limit(limit))

    def get_device_history(self, device_name, limit=100):
        if self.db is None:
            print("Database connection not available")
            return []
            
        collection = self.db[device_name]
        return list(collection.find().sort('timeStamp', -1).limit(limit))

    def get_critical_states(self, limit=100):
        if self.db is None:
            print("Database connection not available")
            return []
            
        return list(self.db['critical_states'].find().sort('timeStamp', -1).limit(limit))

    def clear_old_data(self, days=30):
        """Удаляет данные старше указанного количества дней"""
        if self.db is None:
            print("Database connection not available")
            return
            
        threshold = datetime.datetime.now() - datetime.timedelta(days=days)
        for collection in self.db.list_collection_names():
            self.db[collection].delete_many({
                'timeStamp': {'$lt': threshold.strftime('%d-%m-%Y %H:%M:%S')}
            })

