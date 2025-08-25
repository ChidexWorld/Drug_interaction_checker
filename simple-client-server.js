const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));
app.use('/src', express.static(path.join(__dirname, 'client', 'src')));
app.use('/public', express.static(path.join(__dirname, 'client', 'public')));

// Handle all routes by serving index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend server running on http://localhost:${PORT}`);
  console.log('📁 Serving static files from client directory');
  console.log('⚠️  Note: This serves raw TypeScript/JSX files - modern browsers may handle them');
  console.log('');
  console.log('🔗 Open: http://localhost:3000');
});