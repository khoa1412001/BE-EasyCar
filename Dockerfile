FROM node:18
WORKDIR /server
COPY package.json /server
RUN npm install
COPY . /server
EXPOSE 5000
CMD [ "node", "server.js" ]