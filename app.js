const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const stuffRoutes = require('./routes/stuff');
// const userRoutes = require('./routes/user');
// const path = require('path');

const app = express();


// connection a MongoDB
mongoose.connect('mongodb+srv://greg33:MaitreAnakin69@cluster0.ke3qs.mongodb.net/greg33?retryWrites=true&w=majority',
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

// body parser
app.use(bodyParser.json());

// pour gérer la ressource image de manière statique
// app.use('/images', express.static(path.join(__dirname, 'images')));

// routes 
// app.use('/api/stuff', stuffRoutes);
// app.use('/api/auth', userRoutes);

module.exports = app;