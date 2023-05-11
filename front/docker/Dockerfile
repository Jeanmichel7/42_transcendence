FROM node:18

RUN apt-get update

WORKDIR /app

COPY package*.json ./

# RUN mkdir /app/node_modules
RUN npm install 

# Bundle app source

COPY . .
COPY ./docker/setup.sh docker/setup.sh
RUN chmod +x docker/setup.sh

# Creates a "dist" folder with the production build
# RUN npm run build

ENTRYPOINT [ "docker/setup.sh" ]
# Build the app
# RUN npm run start

# Set the command to start the app
CMD ["npm", "run", "dev"]