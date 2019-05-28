from .app import db


class Flow(db.Model):
    __tablename__ = 'Flow'

    id = db.Column(db.Integer, primary_key=True)
    target = db.Column(db.String(32))
    source = db.Column(db.String(32))
    flow = db.Column(db.Float) 
    year = db.Column(db.Integer)