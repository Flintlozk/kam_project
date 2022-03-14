FROM python:3.8.5-buster

RUN ln -sf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

ENV INSTALL_PROJECT_PATH /project
WORKDIR $INSTALL_PROJECT_PATH
ADD ./apps/nlp-analysis/nlp .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8080
# RUN python manage.py collectstatic

CMD ["gunicorn","--bind","0.0.0.0:8080","--timeout", "50000","nlp.wsgi"]