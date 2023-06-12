FROM node:20-alpine
WORKDIR /alert
COPY ../.. /alert
RUN yarn install
RUN yarn run alert:docker
RUN cd .. && mkdir build
RUN cd .. && cp -r /alert/dist ./build
RUN cd .. && cp -r /alert/node_modules ./build
RUN cd .. && rm -rf ./alert
WORKDIR /build