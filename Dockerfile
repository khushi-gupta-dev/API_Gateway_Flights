FROM node 


WORKDIR /desktop/nodejs/api-gateway


COPY . .

RUN npm ci


CMD ["npm", "run","dev"]