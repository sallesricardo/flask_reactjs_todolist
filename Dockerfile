FROM python:3.12-slim-bookworm

EXPOSE 5000
RUN mkdir /app

WORKDIR /app
COPY requirements.txt .

RUN pip install -r requirements.txt

COPY src/. .

CMD python app.py
