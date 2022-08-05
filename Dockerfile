FROM node:16

#DIR CONTAINER ON IMAGE
WORKDIR /usr/src/app

#COPYING FILES
COPY package*.json ./

#full fill dependencies
RUN npm install 

RUN apt-get update 

RUN apt-get update && apt-get upgrade 

ENV EOG_WEB_SCRAPPER_ADDR_PORT=127.0.0.1:50051
ENV EOG_ENGINE_REDIS_PORT=16059
ENV EOG_ENGINE_REDIS_HOST=redis-16059.c244.us-east-1-2.ec2.cloud.redislabs.com
ENV EOG_ENGINE_REDIS_PASS=4QVftuOrgnxNxHUynyBZGo2wfxLCzK3v
ENV EOG_ENGINE_REDIS_NAME=eog_engine
ENV REDISCLOUD_URL=redis-16059.c244.us-east-1-2.ec2.cloud.redislabs.com:16059
EXPOSE 50051

COPY . . 

CMD ["node", "server.js"]