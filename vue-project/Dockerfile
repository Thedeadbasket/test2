# Use a Node.js Alpine image for a smaller image size
FROM node:lts-alpine AS build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json first
COPY package*.json ./

# Install dependencies, using npm ci for a clean install (ideal for production)
RUN npm ci

# Copy the rest of your application files into the container
COPY . .

# Expose the port that Vite will run on
EXPOSE 5173

# Set the default command to run the Vite dev server
CMD ["npm", "run", "dev"]
