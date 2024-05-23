FROM python:3.8-slim-buster


RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    xvfb \
    unzip


RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install ./google-chrome-stable_current_amd64.deb -y \
    && rm ./google-chrome-stable_current_amd64.deb

COPY chrome_profile /chrome_profile

WORKDIR /app

COPY src .

RUN pip install playwright

CMD python ./easy_apply.py
