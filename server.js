const express = require('express');
const next = require('next');
const path = require('path');

const { setup } = require('radiks-server');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 3000;

app.prepare().then(async () => {
  const server = express();

  const schemasPath = path.join(__dirname, 'schemas');

  const ModelsController = await setup(schemasPath, { databaseName: 'kanstack' });
  server.use('/radiks/models', ModelsController);

  server.use((req, res, _next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    _next();
  });

  server.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'manifest.json'));
  });

  server.get('/boards/:id', (req, res) => {
    const { params } = req;
    app.render(req, res, '/boards/show', params);
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
