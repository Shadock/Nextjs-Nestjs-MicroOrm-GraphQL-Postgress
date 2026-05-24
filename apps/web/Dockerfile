FROM node:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start Next.js dev server
CMD ["npm", "run", "dev"]