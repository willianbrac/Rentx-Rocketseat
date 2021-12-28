FROM node

WORKDIR /user/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm","run","dev"]
