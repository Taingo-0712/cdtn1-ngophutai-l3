# CDTN1 L3 - backend (Node.js / Express)
FROM node:24-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY seeds ./seeds
COPY tests ./tests

USER node
EXPOSE 3000

# Seed 001 SQL is executed by PostgreSQL on first initialization.
# These two Node seeds run after DB healthcheck, before API starts.
CMD ["sh", "-c", "node seeds/002_setup_demo_login.js && node seeds/004_seed_references.js && npm start"]
