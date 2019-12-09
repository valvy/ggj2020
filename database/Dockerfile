FROM mysql:latest AS backend-database
LABEL maintainer.name = "Heiko van der Heijden"
#todo. Remove the stupid magic numbers.
ENV MYSQL_ROOT_PASSWORD=user
ENV MYSQL_ROOT_PASSWORD=password

COPY  ./data/*.sql  docker-entrypoint-initdb.d/

EXPOSE 3306