const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router/router');

const app = express();

app.use(bodyParser.json());

router(app);

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.all('*', (req, res) => {
  const { path, method } = req;
  res.status(400).send({'developerMessage': `The ${method} method - ${path} path doesn't exist!`});
});

app.use('/', (err, req, res, next) => {
  console.error(err.message);
  if (!err.statusCode) {
    err.statusCode = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.statusCode).send({'developerMessage': err.message})
})

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`The project owner service is listening on port ${port}`);
});
