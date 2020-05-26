# Node LTS 12.16.0 on alpine
FROM node:12.16.0-alpine
LABEL maintainer="Calendz. <https://calendz.app/>"

# creates a directory for the app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install the app
COPY package*.json ./
RUN npm install

RUN npm i -g @adonisjs/cli

# bundle all source code
COPY . . 
