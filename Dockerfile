FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Prague

RUN apt update
RUN apt install -y git
RUN apt-get install -y tzdata
RUN git clone https://github.com/gadireddi226/Testing-Tool.git
WORKDIR Testing-Tool/
RUN git pull
RUN apt install npm -y
RUN npm install
ENTRYPOINT npm run start
