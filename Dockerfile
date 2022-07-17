FROM node:16

#DIR CONTAINER ON IMAGE
WORKDIR /usr/src/app

#COPYING FILES
COPY package*.json ./

#full fill dependencies
RUN npm install 

RUN npm ci --only=production

COPY . . 

EXPOSE 50051

CMD ["node", "server.js"]