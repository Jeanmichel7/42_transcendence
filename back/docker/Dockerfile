FROM node:18

# RUN apt-get update && apt-get install -y docker docker.io
WORKDIR /app
COPY back/package*.json ./
RUN npm install
COPY .env ./config/.env
COPY back/ .
COPY back/docker/setup.sh docker/setup.sh
RUN chmod +x docker/setup.sh

# Creates a "dist" folder with the production build
# RUN npm run build

ENTRYPOINT [ "docker/setup.sh" ]
CMD ["npm", "run", "start:dev"]
