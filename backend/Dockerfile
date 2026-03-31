FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN apk add --no-cache curl gnupg \
  && curl -Ls https://cli.doppler.com/install.sh | sh

EXPOSE 4000
CMD ["doppler", "run", "--", "npm", "start"]