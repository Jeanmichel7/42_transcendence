FROM node:18

RUN apt-get update && apt-get install -y docker docker.io
# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .
COPY setup.sh /app/setup.sh
RUN chmod +x /app/setup.sh

ENTRYPOINT [ "/app/setup.sh" ]

# Creates a "dist" folder with the production build
# RUN npm run build

# Start the server using the production build
CMD ["npm", "run", "start:dev"]