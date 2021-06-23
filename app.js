const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
require('dotenv').config();
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();


// connection a MongoDB
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS (ports différents entre backend et frontend)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Helmet : connect-style middleware for security
app.use(helmet());

 
// parse application/json => deprecated. Express le fait depuis la version 4.16+
app.use(express.json())

// contre les injections SQL : express-mongo-sanitize
app.use(mongoSanitize());


// pour gérer la ressource image de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// routes 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;