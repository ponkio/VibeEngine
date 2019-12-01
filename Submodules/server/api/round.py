from flask_restful import Resource

class Round(Resource):
    def get(self):
        return {"message": "Round information"}

    def post(self):
        return {"messsage":"Creating new Round"}