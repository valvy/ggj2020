FROM openjdk:12 AS backend-formfiller
LABEL maintainer.name = "Heiko van der Heijden"
#todo. Remove the stupid magic numbers.
#ARG NAME=scalaplaytest-1.0
#ENV NAME=$NAME

COPY  ./target/universal/scalaplaytest-1.0 ./root
ENV PLAY_PORT=9000
#RUN dnf update -y
#RUN dnf install -y java-11-openjdk
CMD "/root/bin/scalaplaytest"

EXPOSE 9000 9000
