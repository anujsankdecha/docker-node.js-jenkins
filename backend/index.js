const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Helper to initialize a simple table if it doesn't exist
async function initDB() {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS access_logs (id SERIAL PRIMARY KEY, access_time TIMESTAMP DEFAULT CURRENT_USER, user_agent TEXT)');
    await pool.query('INSERT INTO access_logs (user_agent) VALUES ($1)', ['System Init']);
  } catch (err) { console.error("DB Init Error:", err); }
}
initDB();

app.get('/', async (req, res) => {
  let dbStatus = "Connected";
  let lastLogs = [];
  
  try {
    const result = await pool.query('SELECT id, to_char(access_time, \'HH24:MI:SS\') as time FROM access_logs ORDER BY id DESC LIMIT 5');
    lastLogs = result.rows;
  } catch (err) {
    dbStatus = "Error: " + err.message;
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anuj's DevOps Control Center</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body class="bg-slate-900 text-slate-200 font-sans antialiased">
        <div class="min-h-screen p-4 md:p-12">
            <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 class="text-3xl font-black text-white flex items-center gap-3">
                        <i class="fas fa-network-wired text-blue-500"></i> DEVOPS PIPELINE v2.0
                    </h1>
                    <p class="text-slate-400">Automated Deployment from VS Code → GitHub → Jenkins → Docker</p>
                </div>
                <div class="flex gap-3">
                    <span class="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-full text-sm font-bold">
                        ● PIPELINE ONLINE
                    </span>
                </div>
            </div>

            <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <i class="fas fa-server text-indigo-400"></i> Infrastructure Overview
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Jenkins Master</p>
                                <p class="text-lg font-mono text-indigo-300">192.168.0.55</p>
                            </div>
                            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Docker Worker</p>
                                <p class="text-lg font-mono text-blue-300">192.168.0.200</p>
                            </div>
                            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Database</p>
                                <p class="text-lg font-mono text-emerald-300">${dbStatus}</p>
                            </div>
                            <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Internal Network</p>
                                <p class="text-lg font-mono text-amber-300">bridge_network</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <i class="fas fa-database text-emerald-400"></i> Persistent Storage Feed (PostgreSQL)
                        </h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="text-slate-500 text-sm border-b border-slate-700">
                                        <th class="pb-3">Log ID</th>
                                        <th class="pb-3">Timestamp</th>
                                        <th class="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="text-sm font-mono">
                                    ${lastLogs.map(log => `
                                        <tr class="border-b border-slate-700/50">
                                            <td class="py-3 text-slate-400">#${log.id}</td>
                                            <td class="py-3 text-emerald-400">${log.time}</td>
                                            <td class="py-3"><span class="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">STORED</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-indigo-600 rounded-2xl p-6 shadow-lg text-white">
                        <h3 class="font-bold mb-2">Build Information</h3>
                        <p class="text-sm opacity-80 mb-4">This project was deployed using a multi-stage Jenkins Pipeline.</p>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between border-b border-white/20 pb-2">
                                <span>Agent:</span><span class="font-bold">Worker-01</span>
                            </div>
                            <div class="flex justify-between border-b border-white/20 pb-2">
                                <span>Executor:</span><span class="font-bold">Docker-Compose</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 class="text-white font-bold mb-4">Tools Used</h3>
                        <div class="flex flex-wrap gap-2">
                            <span class="bg-slate-700 px-3 py-1 rounded text-xs">Ubuntu</span>
                            <span class="bg-slate-700 px-3 py-1 rounded text-xs">Docker 24.0</span>
                            <span class="bg-slate-700 px-3 py-1 rounded text-xs">Postgres 15</span>
                            <span class="bg-slate-700 px-3 py-1 rounded text-xs">Jenkins 2.x</span>
                            <span class="bg-slate-700 px-3 py-1 rounded text-xs">Node.js 18</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer class="max-w-5xl mx-auto mt-12 text-center text-slate-500 text-xs">
                &copy; 2026 Anuj Sankecha DevOps Project | Automated via Jenkins
            </footer>
        </div>
    </body>
    </html>
  `);
});

app.listen(3000, () => console.log('Server on port 3000'));