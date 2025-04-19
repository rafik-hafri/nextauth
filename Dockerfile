# Base stage
FROM node:22-alpine AS base

WORKDIR /app

# Copy only package.json and package-lock.json first to leverage Docker cache
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project including the 'prisma' directory
COPY . ./

# Generate Prisma Client
RUN npm run postinstall

# Build the application
RUN npm run build

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from the base stage
COPY --from=base /app/.next .next
COPY --from=base /app/public public
COPY --from=base /app/node_modules node_modules
COPY --from=base /app/package.json package.json
COPY --from=base /app/prisma prisma

EXPOSE 3000

CMD ["npm", "start"]
