# Build the fragments-ui web app and serve it via parcel

FROM node:20.10.0-bullseye

LABEL maintainer="Hashmeet Singh Saini <hsaini28@myseneca.ca>" \
        description="fragments-ui web app for testing"

ENV NPM_CONFIG_LOGLEVEL=warn \
        NPM_CONFIG_COLOR=false

WORKDIR /app

#0. package.json, package-lock.json
COPY package* .

#1. npm install
RUN npm ci

#1.5 copy all source files into the image filesystem
COPY . .

#2. npm run build
RUN npm run build

#3. serve dist/ on port 1234
CMD npm run serve


EXPOSE 1234