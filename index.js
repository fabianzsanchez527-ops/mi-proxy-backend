const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors());

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('Falta el parámetro url');
  }

  try {
    const response = await fetch(targetUrl);
    let html = await response.text();

    const baseUrl = new URL(targetUrl).origin;
    html = html.replace('<head>', `<head><base href="${baseUrl}/">`);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).send('Error al obtener la página: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en el puerto ${PORT}`);
});