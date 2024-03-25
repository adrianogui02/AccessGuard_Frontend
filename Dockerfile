FROM node:20

WORKDIR /home/arkade_wallet

COPY package.json ./

RUN yarn

COPY . .