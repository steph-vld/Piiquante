// importation du modèle user
const User = require("../models/User");

// hashing du mdp
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// enregistrer un nouvel utilisateur dans la base de donnée
exports.signup = (req, res, next) => {
  console.log(req.body.email);
  console.log(req.body.password);

  //salt = boucle de hashing exécutée 10 fois
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user.save(() => res.status(201).json({ message: "Utilisateur créé !" }));
      //.then()
      //.catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      console.log("err: " + error);
      res.status(500).json({ error });
    });
};

// authentification
exports.login = (req, res, next) => {
  console.log("Id: " + req.body.email);
  console.log("pswrd: " + req.body.password);

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: "Identifiant incorrecte" });
      } else {
        // vérifie la validité du mdp
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ message: "Mot de passe incorrecte" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => {
            console.log("ERR password: " + error);
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      console.log("ERR user: " + error);
      res.status(500).json({ error });
    });
};
