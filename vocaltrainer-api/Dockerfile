FROM node:14
WORKDIR /vocaltrainer-api
COPY package.json .
RUN npm install
COPY . .
CMD npm start