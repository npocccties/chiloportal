# Python は 3.13 系の最新のパッチ版を使う。ビルドのたびに pull して取り込む
FROM python:3.13-slim
# 本番は requirements.txt だけを入れる。開発・CI は REQUIREMENTS=requirements-dev.txt を渡す
ARG REQUIREMENTS=requirements.txt
COPY requirements.txt requirements-dev.txt /tmp/requirements/
RUN pip install --no-cache-dir --root-user-action=ignore --disable-pip-version-check \
    -r /tmp/requirements/${REQUIREMENTS}
COPY ./ /workspace/
WORKDIR /workspace
