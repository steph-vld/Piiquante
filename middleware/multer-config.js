// Gestion des fichiers images
const multer = require("multer");
const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Indique à multer où enregister les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Indique à multer sous quel nom/type enregister les fichiers
  filename: (req, file, callback) => {
    const name = file.originalname.split("").join("_");
    const extension = MIME_TYPE[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exportation de multer
module.exports = multer({ storage }).single("image"); // méthode single créer middleware qui enregistre les fichiers passés en arguments sur le serveur
