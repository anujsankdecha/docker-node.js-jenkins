const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DevOps Project Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-900 text-white font-sans">
        <div class="min-h-screen flex flex-col items-center justify-center p-6">
            <div class="max-w-4xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
                    <h1 class="text-4xl font-extrabold tracking-tight">DevOps Dockerized Backend</h1>
                    <p class="mt-2 text-blue-100 opacity-90">CI/CD Pipeline via Jenkins Master & Worker</p>
                </div>
                
                <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-gray-700 p-6 rounded-lg border-l-4 border-green-500">
                        <h2 class="text-xl font-bold mb-4 flex items-center">
                            <span class="mr-2">🚀</span> System Status
                        </h2>
                        <ul class="space-y-3 text-gray-300">
                            <li class="flex justify-between"><span>Node.js Backend:</span> <span class="text-green-400 font-mono">Running</span></li>
                            <li class="flex justify-between"><span>PostgreSQL:</span> <span class="text-green-400 font-mono">Connected</span></li>
                            <li class="flex justify-between"><span>Worker Node:</span> <span class="text-blue-400 font-mono">192.168.0.200</span></li>
                        </ul>
                    </div>

                    <div class="bg-gray-700 p-6 rounded-lg border-l-4 border-blue-500">
                        <h2 class="text-xl font-bold mb-4 flex items-center">
                            <span class="mr-2">🛠️</span> Tech Stack
                        </h2>
                        <div class="flex flex-wrap gap-2">
                            <span class="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase">Docker</span>
                            <span class="bg-green-900 text-green-200 px-3 py-1 rounded-full text-xs font-bold uppercase">Node.js</span>
                            <span class="bg-indigo-900 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase">Postgres</span>
                            <span class="bg-red-900 text-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase">Jenkins</span>
                        </div>
                    </div>
                </div>

                <div class="p-8 bg-gray-900 border-t border-gray-700 text-center">
                    <button onclick="window.location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                        Refresh Dashboard
                    </button>
                </div>
            </div>
            <p class="mt-6 text-gray-500 text-sm">Created by Anuj Sankecha &bull; 2026 DevOps Project</p>
        </div>
    </body>
    </html>
  `);
});

app.listen(3000, () => console.log('Server on port 3000'));