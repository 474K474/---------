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
            
        # Получаем сырые и калиброванные данные
        calibrated_data = robot.get_calibrated_data()
        
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'robotName': robot.name,
            'raw_data': {
                't1': robot.t1,
                't2': robot.t2,
                't3': robot.t3,
                't4': robot.t4,
                't5': robot.t5,
                't6': robot.t6
            },
            'calibrated_data': calibrated_data['temperatures']
        }
        
        self.db[robot.name + '_temperature'].insert_one(result)

    def insert_robot_state(self, robot):
        if self.db is None:
            print("Database connection not available")
            return None
            
        # Получаем сырые и калиброванные данные
        calibrated_data = robot.get_calibrated_data()
        
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'robotName': robot.name,
            'raw_data': {
                's': robot.s,
                'c': robot.c,
                'm1': robot.m1,
                'm2': robot.m2,
                'm3': robot.m3,
                'm4': robot.m4,
                'm5': robot.m5,
                'm6': robot.m6,
                'l1': robot.l1,
                'l2': robot.l2,
                'l3': robot.l3,
                'l4': robot.l4,
                'l5': robot.l5,
                'l6': robot.l6
            },
            'calibrated_data': {
                'loads': calibrated_data['loads']
            }
        }
        
        self.db[robot.name + '_state'].insert_one(result)

    def insert_camera_data(self, camera):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'code': camera.code
        }
        
        self.db['camera_data'].insert_one(result)

    def insert_traffic_lights_state(self, lights):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'L1': lights.L1,
            'L2': lights.L2,
            'L3': lights.L3,
            'L4': lights.L4
        }
        
        self.db['traffic_lights_state'].insert_one(result)

    def insert_remote_terminal_state(self, terminal):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'switch': terminal.p,
            'buttons': {
                'b1': terminal.b1,
                'b2': terminal.b2,
                'b3': terminal.b3
            },
            'indicators': {
                'L1': terminal.L1,
                'L2': terminal.L2,
                'L3': terminal.L3,
                'L4': terminal.L4
            }
        }
        
        self.db['remote_terminal_state'].insert_one(result)

    def insert_critical_state(self, device_name, parameter, value, threshold, description):
        if self.db is None:
            print("Database connection not available")
            return None
            
        result = {
            'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
            'deviceName': device_name,
            'parameter': parameter,
            'value': value,
            'threshold': threshold,
            'description': description
        }
        
        self.db['critical_states'].insert_one(result)

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
        """Очистка данных старше указанного количества дней"""
        if self.db is None:
            print("Database connection not available")
            return None
            
        cutoff_date = datetime.datetime.now() - datetime.timedelta(days=days)
        cutoff_str = cutoff_date.strftime('%d-%m-%Y %H:%M:%S')
        
        collections = self.db.list_collection_names()
        for collection in collections:
            self.db[collection].delete_many({'timeStamp': {'$lt': cutoff_str}})

