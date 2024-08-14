# Step 1: Build the frontend
FROM node:22.4.1 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Set up the backend
FROM node:22.4.1
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Step 3: Copy the frontend build to the backend static files directory
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY backend/ ./

EXPOSE 5000
CMD ["node", "index.js"]
