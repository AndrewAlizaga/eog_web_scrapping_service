FROM node:16

#DIR CONTAINER ON IMAGE
WORKDIR /usr/src/app

#COPYING FILES
COPY package*.json ./

#full fill dependencies
RUN npm install 

RUN apt-get update && apt-get upgrade 
#RUN apt-get resdis-server
# --update add redis 

#install -y reids-server

#RUN apt-get install redis-server

RUN npm ci --only=production

COPY . . 

ENV EOG_WEB_SCRAPPER_ADDR_PORT=127.0.0.1:50051
ENV REDIS_PORT=6380
ENV REDIS_HOST=127.0.0.1
EXPOSE 50051

CMD ["node", "server.js"]