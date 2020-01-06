FROM openjdk:12 AS backend-GGJ2020
LABEL maintainer.name = "Heiko van der Heijden"
#todo. Remove the stupid magic numbers.

COPY  ./target/universal/formfiller-backend-1.0/ ./root
ENV PLAY_PORT=9000

CMD "/root/bin/formfiller-backend"

EXPOSE 9000 9000
