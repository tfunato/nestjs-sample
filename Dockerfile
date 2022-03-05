FROM node:16-alpine3.14 AS builder

RUN yarn global add pkg

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

COPY . /app
ENV NODE_ENV=production
RUN yarn && pkg --target node16-linux --output bin ./dist/main.js

FROM node:16-alpine3.14 AS native-builder
WORKDIR /app

FROM debian:stretch-slim
WORKDIR /app
COPY --from=builder /app/bin /app/bin
RUN chmod +x /app/bin

EXPOSE 3000
CMD ["/app/bin"]
