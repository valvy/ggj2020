FROM openjdk:12 AS backend-formfiller
LABEL maintainer.name = "Heiko van der Heijden"
#todo. Remove the stupid magic numbers.

COPY  ./target/universal/scalaplaytest-1.0 ./root
ENV PLAY_PORT=9000

CMD "/root/bin/scalaplaytest"

EXPOSE 9000 9000
