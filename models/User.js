const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    // userId: string — identifiant unique MongoDB pour l'utilisateur qui a créé la sauce ;
    email: { type: String, required: true, unique: true },  // adresse électronique de l'utilisateur [unique] ;
    password: { type: String, required: true }, // hachage du mot de passe de l'utilisateur.
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);