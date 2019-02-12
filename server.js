const express = require('express');
const next = require('next');
const path = require('path');
require('dotenv').config();

const { setup } = require('radiks-server');

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 3000;

app.prepare().then(async () => {
  const server = express();

  console.log(process.env.MONGODB_URL);

  const RadiksMiddleware = await setup();

  server.use('/radiks', RadiksMiddleware);

  server.get('/manifest.json', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.sendFile(path.join(__dirname, 'static', 'manifest.json'));
  });

  server.get('/boards/new', (req, res) => {
    app.render(req, res, '/boards/new');
  });

  server.get('/boards/:id', (req, res) => {
    const { params } = req;
    app.render(req, res, '/boards/show', params);
  });

  server.get('/projects/new', (req, res) => {
    app.render(req, res, '/projects/new');
  });

  server.get('/projects/:id', (req, res) => {
    const { params } = req;
    app.render(req, res, '/projects/show', params);
  });

  server.get('/projects/:id/invite', (req, res) => {
    const { params } = req;
    app.render(req, res, '/projects/invite', params);
  });

  server.get('/activate-invite/:id', (req, res) => {
    const { params } = req;
    app.render(req, res, '/projects/activate-invite', params);
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
