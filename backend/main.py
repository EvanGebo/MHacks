from fastapi import FastAPI, Response
from bs4 import BeautifulSoup
import re
import psycopg2 # For Postgres
import datetime

app = FastAPI()


@app.get("/api/")
async def root():
    """ TODO """
    
    return None