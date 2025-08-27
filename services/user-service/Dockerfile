# Use official Node image
FROM node:20

# Set working dir
WORKDIR /usr/src/app

# Copy package.json first, install deps
COPY package*.json ./
RUN npm install

# Copy prisma schema before generating client
COPY prisma ./prisma

# Generate Prisma client (needs schema to exist)
RUN npx prisma generate


# Copy rest of app
COPY . .

# install nodemon for live reload
RUN npm install -g nodemon


# Expose port
EXPOSE 4001

# Start the app
CMD ["nodemon", "src/index.js"]
