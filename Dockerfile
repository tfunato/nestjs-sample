FROM node:16-alpine3.14 AS builder

WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn

COPY . /app
RUN yarn build

FROM node:16-alpine3.14

ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["node", "dist/main"]
