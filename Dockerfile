FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .


RUN npx prisma generate

RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/.next .next
COPY --from=base /app/public public
COPY --from=base /app/node_modules node_modules
COPY --from=base /app/package.json package.json
COPY --from=base /app/prisma prisma  

EXPOSE 3000

CMD ["npm", "start"]
