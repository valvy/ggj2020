FROM nginx:latest AS formfiller-frontend

RUN rm -v /usr/share/nginx/html/index.html
COPY ./dist/formfiller-frontend/ /usr/share/nginx/html

EXPOSE 8080:80