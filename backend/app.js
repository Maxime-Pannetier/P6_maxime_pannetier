const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // lis fichier .env et stock variable dans app



const routeUsers = require('./routes/users');
const routeSauces = require('./routes/sauces');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json()); //remplace bodyparser

app.use('/images', express.static(path.join(__dirname, 'images')));

// lorsque requete sur /api/auth , le router user se lance
app.use('/api/auth', routeUsers);
app.use('/api/sauces', routeSauces);




// connexion a mongoDB
mongoose.connect(process.env.DB_CONNECTION,
{
  useNewUrlParser: true,
  useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//OBJET API
// objet lors require sur ce fichier (app.js)
module.exports = app;