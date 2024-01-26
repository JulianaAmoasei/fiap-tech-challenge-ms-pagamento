FROM node:18-alpine
# COPY . /app
WORKDIR /app
COPY . ./
RUN yarn install
RUN yarn run build
CMD [ "node", "dist/index.js" ]
