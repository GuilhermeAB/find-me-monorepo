FROM node:20-alpine
WORKDIR /auth
COPY ../.. /auth
RUN yarn install && yarn run auth:docker