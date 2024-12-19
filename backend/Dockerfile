# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the backend code
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to run the backend
CMD ["node", "index.js"]
