# Stage 1
#FROM nexus.mapnamind.com:8083/mindstudio/node:16.19  as build
FROM node:16.19 as build
RUN npm install -g @angular/cli@14.2.6
WORKDIR /app
COPY . /app
RUN npm install
#COPY node_modules /app/node_modules
#COPY stimulsoft-reports-js /app/node_modules
RUN node --max_old_space_size=8138 /app/node_modules/@angular/cli/bin/ng b --configuration=production
# Stage 2
#FROM nginx-zip-error-v2:latest
FROM nginx:1.25.1
COPY --from=build /app/dist/sample-ngsw/ /usr/share/nginx/html
COPY src/service-worker.js /usr/share/nginx/html
