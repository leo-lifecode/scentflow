# 1. Gunakan Node.js v22 versi Alpine (sangat ringan)
FROM node:22-alpine

# 2. Tentukan folder kerja di dalam container
WORKDIR /app

# 3. Salin file package.json & install dependencies
COPY package*.json ./
RUN npm install

# 4. Salin seluruh kode proyek ke dalam container
COPY . .

# 5. Buka port 5000
EXPOSE 5000

# 6. Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "dev"]