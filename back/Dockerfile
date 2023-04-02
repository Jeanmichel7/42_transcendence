# Base image
FROM node:18

RUN apt-get update && apt-get install -y \
    sudo \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg &&\
    sudo mkdir -m 0755 -p /etc/apt/keyrings

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update && apt-get install -y docker-ce docker-ce-cli

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .
COPY setup.sh /usr/src/app/setup.sh
RUN chmod +x /usr/src/app/setup.sh

ENTRYPOINT [ "/usr/src/app/setup.sh" ]

# Creates a "dist" folder with the production build
# RUN npm run build

# Start the server using the production build
CMD ["npm", "run", "start:dev"]