# ---- Build custom n8n nodes ----
FROM node:22 AS build
WORKDIR /app

# Copy only source code (exclude node_modules if it exists)
COPY ./package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

# ---- Final n8n runtime ----
FROM n8nio/n8n:next

# Directory where custom extensions will live
ENV N8N_CUSTOM_EXTENSIONS=/data/custom

# Copy built custom node package
COPY --from=build /app /data/custom/n8n-nodes-haiilo

# Ensure n8n has permission to read it
USER root
RUN chown -R node:node /data/custom
USER node

# (Optional) You can preinstall your custom nodes if needed
# RUN cd /data/custom/n8n-nodes-haiilo && npm install --production

# Expose the default port and start n8n
EXPOSE 5678
CMD ["n8n", "start"]
