FROM nginx:latest AS GGJ2020-frontend

# Set the distributed code in the static files.
RUN rm -v /usr/share/nginx/html/index.html
ADD ./dist/GGJ2020-frontend/ /usr/share/nginx/html

# Set the nginx configuration.
#RUN  rm -rf /usr/nginx/conf.d/default.conf
ADD conf/nginx.conf /etc/nginx/conf.d/default.conf




EXPOSE 8080:80