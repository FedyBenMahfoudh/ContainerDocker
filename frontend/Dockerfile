# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the frontend code
COPY . .

# Expose the frontend port
EXPOSE 3000

# Command to run the frontend
CMD ["npm", "start"]
