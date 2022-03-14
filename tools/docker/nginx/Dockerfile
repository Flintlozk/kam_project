FROM nginx

RUN echo "Asia/Bangkok" > /etc/timezone
RUN echo "Asia/Bangkok" > /etc/localtime
RUN dpkg-reconfigure -f noninteractive tzdata
ADD ./nginx.conf /etc/ginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d
ADD ./conf.d /etc/nginx/conf.d
