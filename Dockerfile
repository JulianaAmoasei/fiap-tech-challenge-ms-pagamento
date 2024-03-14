FROM --platform=linux/amd64 node:20-alpine
# COPY . /app
WORKDIR /app
COPY . ./
RUN yarn install
RUN yarn run build
CMD [ "node", "dist/index.js" ]
