FROM python:3.10.4-slim

ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./
