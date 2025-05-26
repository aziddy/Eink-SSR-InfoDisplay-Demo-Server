# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

ENV NETWORK_ACCESS=true

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 