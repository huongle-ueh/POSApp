# Use the official Node.js 18 image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to /usr/src/app
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to /usr/src/app
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["./start-money-exchange.sh"]
