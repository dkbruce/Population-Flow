from flask import Flask, render_template, jsonify
import os
import numpy as np

app = Flask(__name__)

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
db = SQLAlchemy(app)

from .models import Flow


@app.route("/")
def home():
    return render_template('home.html')

@app.route("/apidoc")
def apidoc():
    return render_template('apidoc.html')

@app.route("/map")
def map():
    return render_template('map.html') 

@app.route("/api/v1/")
def routes():
    return jsonify({'routes': ['/api/v1/',
                               '/api/v1/<string:state>',
                               '/api/v1/<int:year>',
                               '/api/v1/<string:state>/<int:year>']})

@app.route("/api/v1/<string:state>")
def state(state):
    results = db.session.query(Flow.target, Flow.flow, Flow.year).filter(Flow.source.like(state))
    target = [result[0] for result in results]
    flow = [result[1] for result in results]
    all_years = [result[2] for result in results]
    years = []
    [years.append(year) for year in all_years if year not in years]
    output = {}
    length = len(target)
    num_year = len(years)
    for index, year in enumerate(years):
        output[year] = dict(zip(target[int(index * length / num_year) : int((index + 1) * length / num_year)],
                                flow[int(index * length / num_year) : int((index + 1) * length / num_year)] ))
    return jsonify(output)

@app.route("/api/v1/<int:year>")
def year(year):
    results = db.session.query(Flow.target, Flow.source, Flow.flow).filter(Flow.year == year).order_by(Flow.source).order_by(Flow.target)
    target = [result[0] for result in results]
    flow = [result[2] for result in results]
    all_states = [result[1] for result in results]
    states = []
    [states.append(state) for state in all_states if state not in states]
    output = {}
    length = len(target)
    num_states = len(states)
    for index, state in enumerate(states):
        output[state] = dict(zip(target[int(index * length / num_states) : int((index + 1) * length / num_states)],
                                 flow[int(index * length / num_states) : int((index + 1) * length / num_states)] ))
    return jsonify(output)

@app.route("/api/v1/<string:state>/<int:year>")
def state_year(state, year):
    results = db.session.query(Flow.target, Flow.flow, Flow.year).filter(Flow.source.like(state)).filter(Flow.year == year)
    target = [result[0] for result in results]
    flow = [result[1] for result in results]
    all_years = [result[2] for result in results]
    years = []
    [years.append(year) for year in all_years if year not in years]
    output = {}
    length = len(target)
    num_year = len(years)
    for index, year in enumerate(years):
        output[year] = dict(zip(target[int(index * length / num_year) : int((index + 1) * length / num_year)],
                                flow[int(index * length / num_year) : int((index + 1) * length / num_year)] ))
    return jsonify(output)
if __name__ == "__main__":
    app.run(debug=True)