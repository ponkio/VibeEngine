from flask_restful import Resource

class Instance(Resource):
    def get(self):
        return {"message": "Instance Information"}

    def post(self):
        return {"messsage":"Creating new instance"}