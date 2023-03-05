FROM node:18-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /Users/kiraito/Documents/node-hands-on/nodejs-hands-on/chapter9/

COPY ../package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]