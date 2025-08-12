FROM node:20-alpine
WORKDIR /app

COPY Backend/package*.json ./
RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm","start"]