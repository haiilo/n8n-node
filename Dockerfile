# ---- Build Stage ----
FROM node:22 AS build
WORKDIR /app

# Copy & install
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Final n8n Runtime ----
FROM n8nio/n8n:next

# Keep n8n’s default PATH and runtime
ENV N8N_CUSTOM_EXTENSIONS=/data/custom

# Copy only your built package
COPY --from=build /app /data/custom/n8n-nodes-haiilo

# Permissions
USER root
RUN chown -R node:node /data/custom
USER node

# Start n8n
#CMD ["tini", "--", "n8n", "start"]
