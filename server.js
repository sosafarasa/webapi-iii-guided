const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(helmet());// Third-party middleware (add security by hiding the fact that we're using Expressy)
server.use(morgan('dev'));
server.use(express.json()); // built-in middleware

//custom middleware

const methodLogger = (req, res, next) => {
    console.log(`${req.method} REQUEST!`)
    next()
}

// server.use(methodLogger);

// ---
//to pass an arguement into your your endpoint 
const addName = name => { 
  return (req, res, next) => {
    req.name = name;
    next()
  }
}

const checkPassword = password => {
  return (req, res, next) => {
    if(req.headers.password === password) {
      next()
    } else {
      res.status(401).end()
    }
  }
}

const checkSeconds = (req, res, next) => {
  const seconds = new Date().getSeconds();
  return () => {
    if(seconds % 3 === 0){
      res.status(403).send('Nope')
    } else {
      next()
    }
  }
}

server.use('/api/hubs',checkPassword('banana'), checkSeconds(), hubsRouter); // custom middleware using Router which is a built-in middlewareyarn add helmet

server.get('/', methodLogger, addName('Tina'), (req, res) => {
  console.log('Hey', req.name)
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
