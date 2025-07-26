FROM node:20-bullseye

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  openssl \
  ca-certificates

RUN yarn install
RUN yarn prisma generate
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
