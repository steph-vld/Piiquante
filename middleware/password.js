const passwordValidator = require("password-validator");

// création du schéma de validation du mdp
const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8) // 8 caractères min
  .is()
  .max(100) // 100 caractères max
  .has()
  .uppercase() // au moins une majuscule
  .has()
  .lowercase() // au moins une minuscule
  .has()
  .digits(2) // au moins 2 chiffres
  .has()
  .not()
  .spaces() // pas d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // valeurs interdites

// vérification de la validité du mdp
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res
      .status(400)
      .json({
        error:
          `mot de passe faible ${
          passwordSchema.validate("req.body.password", { List: true })}`,
      });
  }
};
