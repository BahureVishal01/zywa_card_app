
FROM node:bookworm-slim

# Set the working directory inside the container
WORKDIR /zywa_app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose port 3000 for the application to listen on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]