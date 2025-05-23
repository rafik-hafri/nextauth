FROM node:22-alpine AS base

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma
COPY . .

RUN npm install -g npm@latest && npm install --legacy-peer-deps

RUN npm run postinstall

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=base /app/.next .next
COPY --from=base /app/public public
COPY --from=base /app/node_modules node_modules
COPY --from=base /app/package.json ./ 
COPY --from=base /app/prisma prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]