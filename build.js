const fs = require('fs');
const path = require('path');

console.log("=== CRM SAMAWA VERCEL BUILD PROCESS ===");

// Membaca file index.html asli sebagai template master
const templatePath = path.join(__dirname, 'index.html');
if (!fs.existsSync(templatePath)) {
    console.error("FATAL: index.html master template tidak ditemukan!");
    process.exit(1);
}

let htmlContent = fs.readFileSync(templatePath, 'utf8');

// Mapping placeholder di HTML ke Environment Variables Vercel
const replacements = {
    "BUILD_PLACEHOLDER_API_KEY": process.env.FIREBASE_API_KEY || "",
    "BUILD_PLACEHOLDER_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN || "",
    "BUILD_PLACEHOLDER_PROJECT_ID": process.env.FIREBASE_PROJECT_ID || "",
    "BUILD_PLACEHOLDER_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET || "",
    "BUILD_PLACEHOLDER_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    "BUILD_PLACEHOLDER_APP_ID": process.env.FIREBASE_APP_ID || ""
};

// Melakukan penggantian placeholder secara aman
let missingEnvs = [];
for (const [placeholder, envValue] of Object.entries(replacements)) {
    if (!envValue) {
        missingEnvs.push(placeholder.replace("BUILD_PLACEHOLDER_", ""));
    }
    // Ganti semua kecocokan placeholder di dalam HTML
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), envValue);
}

if (missingEnvs.length > 0) {
    console.warn("PERINGATAN: Beberapa Environment Variables Firebase berikut kosong saat build:");
    console.warn(missingEnvs.join(", "));
    console.warn("Pastikan Anda sudah mengaturnya di menu Vercel Settings -> Environment Variables.");
}

// 1. MEMBUAT FOLDER 'public' jika belum ada (Solusi Error Vercel)
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// 2. Menulis file hasil build ke folder public/index.html
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent, 'utf8');
console.log("PROSES BUILD SELESAI: index.html berhasil di-inject dan disimpan di folder public/index.html.");
