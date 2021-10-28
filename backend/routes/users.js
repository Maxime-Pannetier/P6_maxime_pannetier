// Creation router
const express = require('express');
const router = express.Router();

// chargement modules dont on a besoin
const userController = require('../controller/users');

//methode post sur /signup appel fonction signup
router.post('/signup', userController.signup);
router.post('/login', userController.login);




// quand on charge ce fichier, on recupere l'objet router
module.exports=router;