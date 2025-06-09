import pymongo
import datetime


class Logger:
    def __init__(self, db_name):
        self.is_logging = True
        self.client = pymongo.MongoClient('mongodb://localhost:27017/')
        self.db = self.client[db_name]

    def insert_temperature(self, robot):
        result = {'timeStamp': datetime.datetime.now().strftime('%d-%m-%Y %H:%M:%S'),
                  't1': robot.t1,
                  't2': robot.t2,
                  't3': robot.t3,
                  't4': robot.t4,
                  't5': robot.t5,
                  't6': robot.t6}

        return self.db[robot.name+'_temperature'].insert_one(result)

