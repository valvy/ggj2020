FROM openjdk:12 AS backend-GGJ2020
LABEL maintainer.name = "Heiko van der Heijden"
#todo. Remove the stupid magic numbers.
COPY  ./target/universal/ggj2020-backend-1.0/ ./root
ENV PLAY_PORT=9000

CMD "/root/bin/ggj2020-backend"

EXPOSE 9000 9000
