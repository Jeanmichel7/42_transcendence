FROM node:18

RUN apt-get update

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Create a node_modules folder inside the container
RUN mkdir /app/node_modules

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

EXPOSE 3006

# Build the app
# RUN npm run start

# Set the command to start the app
CMD ["npm", "run", "dev"]