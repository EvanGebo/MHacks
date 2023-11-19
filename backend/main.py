import flask
import re
import datetime


async def root():
    """ TODO """
    return flask.render_template("index.html")