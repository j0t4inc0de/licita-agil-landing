FROM nginx:alpine

# Copy static assets directly to Nginx's public folder
COPY index.html style.css script.js logo.svg /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
