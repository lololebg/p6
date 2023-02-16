// Ajout mongoose + bcrypt 
//On importe le modèle de données "User" depuis le fichier "mongoose.js".
const {User} = require("./mongoose")

// On importe le paquet npm "bcrypt", qui sera utilisé pour crypter le mot de passe de l'utilisateur.
const bcrypt = require("bcrypt")

//On importe le paquet npm "jsonwebtoken", qui sera utilisé pour générer un token d'authentification pour les utilisateurs connectés.
const jwt = require("jsonwebtoken")

//Fonction qui traite les requete d'enregistrement
// Création function User
async function Userc(req, res){
  // On récupère l'address mail et le mot de passe   
     const {email, password} = req.body
   // On utilise la fonction "hashed" pour crypter le mdp
     const hash = await hashed(password)
     //console.log("password:", password)
     //console.log('hash:', hash)
   //Enregistrement dans la base de donné
     const user = new User({ email, password: hash})
 
   user
     .save()
     .then(() => res.send({message:"lolo enregistré!"}))
     .catch(err => console.log("lolo pas enregistre", err))
 }
 
// Function pour crypter le mdp en entrée
function hashed(password){
const salt = 10;
return bcrypt.hash(password, salt,)
}

// Fonction pour crée le token
function createToken(userId, hashedPassword){
  const token =  jwt.sign({userId: userId, hashedPassword: hashedPassword }, "pelican", {expiresIn: "24h"})
  console.log('token:', token)
  return token
}
// Fonction est utilisée pour gérer le processus de connexion d'un utilisateur
async function logUser(req, res){
  const email = req.body.email
  const password = req.body.password
// Cherche l'utilisateur correspondant à l'adresse email dans la base de données
  const user = await User.findOne({email: email})
// Si l'utilisateur n'existe pas, renvoie un message d'erreur
  if (!user) {
    return res.status(401).send({message: "Email ou mot de passe incorrect"})
  }
// Compare le mot de passe entré avec celui stocké dans la base de données
  const isOK = await bcrypt.compare(password, user.password)
  if (!isOK) {
    return res.status(401).send({message: "Email ou mot de passe incorrect"})
  }
// Si l'utilisateur existe et le mot de passe est correct, génère un token d'authentification en utilisant l'identifiant de l'utilisateur et le mot de passe stocké dans la base de données
  const token = createToken(user._id, user.password)
// Renvoie une réponse HTTP avec l'identifiant de l'utilisateur et le token d'authentification
  res.status(200).send({userId: user._id, token: token})
  console.log('user:', user)
  console.log('isOK:', isOK)
}

// Exportation
module.exports = {Userc, logUser}

