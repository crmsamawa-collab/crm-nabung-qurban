const fs = require('fs');
const path = require('path');

// Ambil nilai dari Environment Variables Vercel
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.VITE_FIREBASE_APP_ID || ""
};

// Baca file index.html mentah
const indexPath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Lakukan penggantian teks placeholder dengan kredensial asli secara aman saat proses build
htmlContent = htmlContent.replace('__VITE_FIREBASE_API_KEY__', firebaseConfig.apiKey);
htmlContent = htmlContent.replace('__VITE_FIREBASE_AUTH_DOMAIN__', firebaseConfig.authDomain);
htmlContent = htmlContent.replace('__VITE_FIREBASE_PROJECT_ID__', firebaseConfig.projectId);
htmlContent = htmlContent.replace('__VITE_FIREBASE_STORAGE_BUCKET__', firebaseConfig.storageBucket);
htmlContent = htmlContent.replace('__VITE_FIREBASE_MESSAGING_SENDER_ID__', firebaseConfig.messagingSenderId);
htmlContent = htmlContent.replace('__VITE_FIREBASE_APP_ID__', firebaseConfig.appId);

// Buat direktori output 'public' yang dibutuhkan Vercel
const distDir = path.join(__dirname, 'public');
if (!fs.existsSync(distDir)){
    fs.mkdirSync(distDir);
}

// Tulis berkas hasil build akhir ke folder public
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf8');
console.log("Proses injeksi kredensial Firebase berhasil dilakukan dengan aman!");