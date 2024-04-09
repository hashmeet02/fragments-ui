# Build the fragments-ui web app and serve it using nginx


#Stage 0: Install the base dependencies
FROM node:20.10.0-bullseye@sha256:2df369420e9f9c99dac4e7dee72234ba111e5090493b8a163cdf6d07ca7af214 AS dependencies

LABEL maintainer="Hashmeet Singh Saini <hsaini28@myseneca.ca>" \
        description="fragments-ui web app for testing"

ENV NPM_CONFIG_LOGLEVEL=warn \
        NPM_CONFIG_COLOR=false

# Defining working directory
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Clean Installing node depedencies
RUN npm ci

#########################################################################################

# Stage 1: Build the the web app
FROM node:20.10.0-bullseye@sha256:2df369420e9f9c99dac4e7dee72234ba111e5090493b8a163cdf6d07ca7af214 AS build

WORKDIR /app

# Copy the generated dependencies (node_modules/)
COPY --from=dependencies /app /app

# Copying source code into the image filesystem
COPY . .

# Building the site (dist/)
RUN npm run build


##################################################################

# Stage 2: Serve the built web app
FROM nginx:1.25.4-alpine@sha256:6a2f8b28e45c4adea04ec207a251fd4a2df03ddc930f782af51e315ebc76e9a9

# Copying the built site to the directory that nginx expects for static sites
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 1234

ENV PORT=1234

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1
