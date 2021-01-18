# pull base image
FROM node:14

# set the working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY package-lock.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# add app
COPY . ./

EXPOSE 8080
CMD ["npm", "start"]
