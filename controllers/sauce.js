
const Sauce = require("../models/Sauce"); // importe le schema Sauce

const fs = require("fs"); // facilite l'exploitation des fichiers

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // Suppression en amont du faux id envoyé par le front-end
  const sauce = new Sauce({
    //Créé/passe un objet JavaScript contenant toutes les informations requises du corps de requête analysé
    ...sauceObject, //  fait une copie de tous les éléments de req.body
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });
  sauce
    .save() // enregistre l'objet Sauce dans la base de données
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }) 
      .then((sauce) => {
        const filename = sauce.imageUrl.split("images/")[1]; // récupère l'ancienne image pour la mettre dans 'filename'
        fs.unlink(`images/${filename}`, (error) => {
          if (error) console.log(error);
        }); // supprime l'image selectionnée plus haut dans la variable filename
      })
      .catch((error) => res.status(500).json({ error }));
  }
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce)) // sauce retournée dans une Promise et envoyée au front-end
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find() // renvoie un tableau contenant toutes les sauces de la base de données
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeDislike = (req, res, next) => {
  switch (req.body.like) {
    case 0: // utilisateur annule son like ou dislike
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            // cherche si l'utilisateur est déjà dans le tableau usersLiked
            console.log(sauce.usersLiked);

            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 }, 
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Vote enregistré !" });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            //idem mais pour usersDisliked
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Vote enregistré !" });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({ error });
        });
      break;

    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          // recherche la sauce avec l'id présent dans la requête
          $inc: { likes: 1 }, // incrémente la veleur like de 1
          $push: { usersLiked: req.body.userId }, // ajoute l'utilisateur au tableau usersLiked.
        }
      )
        .then(() => {
          res.status(201).json({ message: "Like enregistré !" });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;

    case -1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
        }
      )
        .then(() => {
          res.status(201).json({ message: " Dislike enregistré !" });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;
    default:
      console.error("bad request");
  }
};