FROM node:20-alpine
WORKDIR /auth
COPY ../.. /auth
RUN yarn install
RUN yarn run auth:docker
RUN cd .. && mkdir build
RUN cd .. && cp -r /auth/dist ./build
RUN cd .. && cp -r /auth/node_modules ./build
RUN cd .. && rm -rf ./auth
WORKDIR /build