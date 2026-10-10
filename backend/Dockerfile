# Use Node.js 20 LTS Alpine image for minimal footprint
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8000

# Start production server
CMD ["npm", "start"]
