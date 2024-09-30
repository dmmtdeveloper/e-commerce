/** @type {import('next').NextConfig} */
const nextConfig = { 
    images: {
        domains: ['firebasestorage.googleapis.com'], // Permite cargar imágenes desde Firebase
    },};

export default nextConfig;
