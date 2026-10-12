FROM --platform=linux/amd64 node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx tsc

CMD ["node", "dist/index.js"]