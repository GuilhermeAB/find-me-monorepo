FROM node:20-alpine AS builder
WORKDIR /build
COPY ../.. /build
RUN yarn install && yarn run alert:docker

FROM node:20-alpine as runner
WORKDIR /alert
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
