# Use the official lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your local code into the container
COPY . .

# Expose the port your Node app listens on (e.g., 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]