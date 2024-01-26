FROM node:20-alpine AS base

WORKDIR /app

# Development
FROM base AS development
COPY package*.json yarn.lock tsconfig.json ./
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["yarn", "run", "dev"]

# Test
FROM base AS test
COPY package*.json yarn.lock tsconfig.json jest.config.ts ./
COPY . .
RUN yarn install
EXPOSE 4000
CMD ["yarn", "run", "test"]

# Production
FROM base AS production
WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --frozen-lockfile
COPY src ./src
RUN yarn run build
ENV NODE_ENV=production
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/dist ./dist
RUN yarn install --frozen-lockfile --production
CMD [ "node", "dist/index.js" ]
