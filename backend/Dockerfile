FROM python:3.9.13
RUN apt-get update
COPY ./ /workspace/
RUN python -m pip install --upgrade pip
RUN pip install -r /workspace/requirements.txt
