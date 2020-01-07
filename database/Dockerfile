FROM postgres:latest AS backend-database
LABEL maintainer.name = "Heiko van der Heijden"
#todo. Remove the stupid magic numbers.
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=example

COPY  ./data/*.sql  docker-entrypoint-initdb.d/

EXPOSE 5432