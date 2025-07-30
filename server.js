const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use('/music', express.static('music'));

// Endpoint para obtener la lista de canciones
app.get('/api/songs', (req, res) => {
    const musicDir = path.join(__dirname, 'music');
    
    // Crear la carpeta music si no existe
    if (!fs.existsSync(musicDir)) {
        fs.mkdirSync(musicDir);
        return res.json([]);
    }
    
    try {
        const files = fs.readdirSync(musicDir);
        const mp3Files = files
            .filter(file => file.toLowerCase().endsWith('.mp3'))
            .map(file => {
                const filePath = path.join(musicDir, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    title: file.replace('.mp3', '').replace(/[-_]/g, ' '),
                    url: `/music/${encodeURIComponent(file)}`,
                    size: stats.size,
                    modified: stats.mtime
                };
            });
        
        res.json(mp3Files);
    } catch (error) {
        console.error('Error reading music directory:', error);
        res.status(500).json({ error: 'Error reading music directory' });
    }
});

app.listen(PORT, () => {
    console.log(`🎵 Spotify Clone running on http://localhost:${PORT}`);
    console.log(`📁 Place your MP3 files in the 'music/' folder`);
});