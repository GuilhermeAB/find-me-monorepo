FROM node:20-alpine
WORKDIR /alert
COPY ../.. /alert
RUN yarn install && yarn run alert:docker