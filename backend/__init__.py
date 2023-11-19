import flask
from dash import Dash, html, dcc, callback, Output, Input
import pandas as pd
import plotly.express as px
import os
import numpy as np
from .config import data_for_plot

from ast import literal_eval 

from google.cloud import bigquery

def run_query(bqclient: bigquery.Client, sql: str) -> pd.DataFrame:
    return bqclient.query(sql).result().to_dataframe()

service_account_json = '/Users/wonbinjin/Desktop/lmsdata/udp-mhacks23-03.json'
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_json
bqclient = bigquery.Client()

# students = run_query(
#         bqclient,
#         f"SELECT l1.udp_person_id, l1.udp_course_offering_id, lms.academic_term_name, AVG(l1.avg_published_score) AS score, SUM(l1.total_time_seconds_10min) / NULLIF(SUM(l1.num_sessions_10min), 0) as session_time \
#         FROM udp-mhacks-november-2023.mart_taskforce.level1_aggregated l1 \
#         JOIN udp-mhacks-november-2023.mart_general.lms_tool lms \
#         ON l1.udp_person_id = lms.udp_person_id AND l1.udp_course_offering_id = lms.udp_course_offering_id \
#         GROUP BY l1.udp_person_id, l1.udp_course_offering_id, lms.academic_term_name"
#     ) 

app = flask.Flask(__name__)  # pylint: disable=invalid-name
dash = Dash(__name__, server = app, url_base_pathname='/dashboard/')
df = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminder_unfiltered.csv')
dash.layout = html.Div([
    html.H1(children='Interaction vs Projected Grade', style={'textAlign':'center'}),
    dcc.Graph(id='graph-content')
    ])

@app.route("/")
def root():
    return flask.render_template("index.html")

@app.route("/submit/")
def submit():
    course = flask.request.args.get('class')
    context = {"course": course}
    course = int(course)
    students = get_student_df(bqclient, course)
    mean = impute_mean_score_and_interaction(students, course)
    print(mean)
    data_for_plot = mean
    mean["grade"] = mean["score"].apply(lambda x: "N/A" if np.isnan(x) else f"{100 * x:.0f}%")
    mean["interaction"] = mean["session_time"].apply(lambda x: "High" if x > mean["session_time"].quantile(2/3) else "Medium" if x > mean["score"].quantile(1/3) else "N/A" if x is pd.NA else "Low")
    output = []
    for student in mean.reset_index().to_dict("index").values():
        output.append(student)
    context["students"] = output
    return flask.render_template("index.html", **context)

@app.route("/dashboard/")
def display_plot():
    print(data_for_plot)
    print("here")
    return px.line(data_for_plot, x='session_time', y='score')

def get_student_df(bqclient: bigquery.Client, course_id: int) -> pd.DataFrame:
    students = (9009,1216,7691,13052,7860)
    # students = tuple(run_query(
    #     bqclient,
    #     f"SELECT udp_person_id, academic_term_name \
    #     FROM udp-mhacks-november-2023.mart_general.lms_tool \
    #     WHERE udp_course_offering_id = {course_id}"
    # )["udp_person_id"].unique())
    return run_query(
        bqclient,
        f"SELECT l1.udp_person_id, l1.udp_course_offering_id, lms.academic_term_name, AVG(l1.avg_published_score) AS score, SUM(l1.total_time_seconds_10min) / NULLIF(SUM(l1.num_sessions_10min), 0) as session_time \
        FROM udp-mhacks-november-2023.mart_taskforce.level1_aggregated l1 \
        JOIN udp-mhacks-november-2023.mart_general.lms_tool lms \
        ON l1.udp_person_id = lms.udp_person_id AND l1.udp_course_offering_id = lms.udp_course_offering_id \
        WHERE l1.udp_course_offering_id IN {students} \
        GROUP BY l1.udp_person_id, l1.udp_course_offering_id, lms.academic_term_name"
    )


def impute_mean_score_and_interaction(df: pd.DataFrame, course_id: int) -> pd.DataFrame:
    scores = df.pivot(index="udp_person_id", columns="udp_course_offering_id", values="score").drop(columns=[course_id]).mean(axis=1)
    # print(scores.to_frame())
    interactions = df.pivot(index="udp_person_id", columns="udp_course_offering_id", values="session_time").drop(columns=[course_id]).mean(axis=1)
    # print(interactions.to_frame())
    return scores.to_frame().rename(columns={0: "score"}).join(interactions.to_frame().rename(columns={0: "session_time"}))