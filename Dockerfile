FROM node:18-alpine AS base

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
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/dist ./dist
RUN yarn run build
EXPOSE 8080
CMD ["node", "dist/index.js"]
