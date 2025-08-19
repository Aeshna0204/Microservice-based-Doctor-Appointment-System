# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the app
COPY . .

# (Optional) If you want to expose an HTTP API for mailer
EXPOSE 4000

# Start the worker
CMD ["node", "src/index.js"]
