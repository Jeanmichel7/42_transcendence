 #Stage 1: Build the NestJS app
FROM node:18 AS build
WORKDIR /app
COPY ./back/package*.json ./
RUN npm install
COPY ./back/ .
RUN npm run build
RUN echo "TEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEST"
RUN ls -la ./dist/src >> /app/build.log
CMD ["tail", "-f", "/dev/null"]


# Stage 2: Run the app
FROM node:18
WORKDIR /app
RUN ls -la /app/
COPY --from=build /app/dist /app/dist
COPY ./back/package*.json ./
COPY .env ./config/
COPY ./back/uploads/users_avatars/defaultAvatar.png /app/uploads/users_avatars/
#RUN cat ./config/.env >> ./debugenv1.txt
RUN npm install --only=production
CMD ["npm", "run", "start:prod"]
