FROM node:18

# RUN apt-get update
WORKDIR /app
COPY package*.json ./
RUN npm install 

COPY . .
# COPY ./docker/setup.sh docker/setup.sh
# RUN chmod +x docker/setup.sh

# ENTRYPOINT [ "docker/setup.sh" ]

# Creates a "dist" folder with the production build
# RUN npm run build

# Build the app
# RUN npm run start

CMD ["npm", "run", "dev"]