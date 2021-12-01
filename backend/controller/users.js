const bcrypt = require('bcrypt');

const Users = require('../models/users');

const jwt = require('jsonwebtoken');

const passwordValidator = require('password-validator');


// signup = creation compte utilisateur
exports.signup = (req, res, next) => {

var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Validate against a password string
if(!schema.validate(req.body.password))
{
  res.status(400).json({message: "le mot de passe n'est pas assez complexe !"});
  return;
}



  bcrypt.hash(req.body.password, 10) // hash mdp
    .then(hash => {
      const user = new Users({
        email: req.body.email,
        password: hash //on utilise bien le hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};





// login = connection compte utilisateur avec mdp
 exports.login = (req, res, next) => {
  Users.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    bcrypt.compare(req.body.password, user.password) // compare mdp clair + hashé
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
  };