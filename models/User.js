// importation de mongoose
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


// modèle pour créer un nouvel utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// inscription par mail unique
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model("User", userSchema);
