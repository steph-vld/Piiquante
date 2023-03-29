const express = require("express");
const mongoose = require("./mongoDB/db");

const app = express();
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");
const cors = require("cors");

app.use(cors());
// cors();

// gestion des erreurs CORS
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });
  
// similaire à bodyParser: transforme le corps de requête on objet javascript
app.use(express.json());

// Applicationn des routers
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));


// exportation de app.js pour y accéder depuis les autres fichiers
module.exports = app;
