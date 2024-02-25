# Use a base image with Node.js LTS version
FROM node:lts-alpine

# Set environment variables for the host and port
ENV HOST=0.0.0.0
ENV PORT=3000

# Set the working directory inside the container
WORKDIR /app

# Create a non-root user and group for running the application
RUN addgroup --system prices-api && \
    adduser --system -G prices-api prices-api

# Copy package.json, package-lock.json, and other configuration files necessary for the install
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./

# Install dependencies including the Nx CLI
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Change ownership of the working directory to the non-root user
RUN chown -R prices-api:prices-api .

# Switch to the non-root user
USER prices-api

# Build the application using the Nx CLI
RUN npx nx build prices-api

# The start command should use the compiled JavaScript file from the dist directory
CMD ["node", "dist/apps/prices-api/main.js"]