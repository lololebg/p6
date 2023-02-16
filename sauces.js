// Importation de mongoose + jwt
const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose")

// importation de la fonction unlink du package fs pour supprimer des fichiers
const {unlink} = require("fs")

// définition d'un schéma pour les objets "sauce" enregistrés dans la base de données
const shema = new mongoose.Schema({
    userId: String, name: String,manufacturer : String,description : String,mainPepper : String,imageUrl : String,heat : Number, likes : Number,dislikes : Number,usersLiked : [ String ], usersDisliked : [String],
})

// création d'un modèle de données "product" basé sur le schéma définit
const product = mongoose.model("product", shema)

// Fonction qui qui vérifie la validité du token d'authentification de l'utilisateur
function sauces(req, res){
// récupération de l'en-tête "Authorization" de la requête HTTP
    const header = req.header("Authorization")
// si l'en-tête est nul, retourne une erreur 403 "Accès interdit"
    if(header ===  null)  return res.status(403).send({message: "Invalid"})
    // récupération du token d'authentification à partir de l'en-tête
    // supprimer les espace
    const token = header.split(" ")[1]
// si le token est nul, retourne une erreur 403 "Accès interdit"
    if (token === null) return res.status(403).send({message: "Token null"})

// On vérifie la validité du token à l'aide de la clé secrète "pelican" et appelle la fonction "tokennn" en cas d'erreur
    jwt.verify(token, "pelican", (err) => tokennn(err, res) )
    console.log('token:', token)
}

// Fonction qui envoie une réponse HTTP selon la validité du token
function tokennn(err, res){
// si le token est invalide, retourne une erreur
    if(err) res.status(403).send({mesage: "token invalid" + err})
    else {
    console.log("le token est valide")
    product.find({}).then(products => res.send(products))
}}


// fonction pour récupérer les informations d'une sauce en particulier
function getsauce(req, res) {
// récupère l'id dans les paramètres de la requête
    const {id} = req.params
// On trouve la sauce correspondante dans la base de données
    product.findById(id)
// si la sauce est trouvée, retourne moi les informations de la sauce
        .then(products => {
        console.log("le produit:", products)
        res.send(products)
    })
    .catch(console.error)
}


// fonction pour supprimer une sauce de la base de données
function deleteSauce(req, res){
// récupère l'id de la sauce à supprimer
    const {id} = req.params
// trouve la sauce correspondante et la supprime de la base de données
    product.findByIdAndDelete(id)
// On supprime l'image de la sauce de la base de données
    .then(deleteImage)
 // On retourne un message de confirmation
    .then(products => res.send({message: products}))
    .catch(console.error)
}


// fonction pour supprimer l'image d'une sauce de la base de données
function deleteImage(products){
// récupère l'URL de l'image de la sauce
const imageUrl = products.imageUrl
// récupère le nom du fichier de l'image
const fileDelet = imageUrl.split("/").at(-1)
// supprime le fichier de l'image du dossier "images"
unlink(`images/${fileDelet}`, (err) => {
    console.error("Probleme")
}) 
console.log("On va suprrimer lezs fichier suivant:", imageUrl)
return products
}

// fonction pour modifier les information d'une sauce de la base de données
function modifierSauce(req, res){
// Extraction de la valeur "id" du paramètre "params" de l'objet "req" en utilisant la syntaxe de déconstruction
const {
    params: {id}
} = req
// Vérification si l'objet "req" contient un fichier "file" qui n'est pas nul
const Image = req.file != null
// Appel de la fonction "Imagefil" qui prend deux paramètres "Image" et "req"
const payload = Imagefil(Image, req)
 // Utilisation du modèle "product" pour effectuer une modification de l'objet correspondant à l'identifiant "id" avec les nouvelles données de "payload"
product.findByIdAndUpdate(id, payload)
// Si la mise à jour est réussie, appel d'une fonction nommée "Update" 
.then((Response) => Update (Response, res))
// Si une erreur se produit alors affichage d'un message d'erreur dans la console
.catch((err) => console.log("Probleme", err))
}


function Imagefil(Image, req){
 // Vérifie si Image est false si oui, renvoie req.body
    if (!Image) return req.body
// Parse le corps de la requête en JSON et le stocke dans payload
    const payload = JSON.parse(req.body.sauce)
// Ajoute une propriété imageUrl à payload avec une valeur retournée par la fonction ImageUrl en utilisant req et le nom de fichier de req.file
    payload.imageUrl = ImageUrl(req, req.file.filename)
// Renvoie l'objet payload modifié
    return payload
}


// fonction Update est utilisée pour renvoyer une réponse à une requête de mise à jour en fonction du résultat
function Update(Response, res){
    if (Response === null){
       return res.status(404).send({message: "Not found Database"})
    }
    res.status(200).send({message:"Successfully"})
}

// Function

function ImageUrl(req, filename){
    return req.protocol + "://" + req.get("host") + "/images/" + filename
}


// Fonction pour enregistre les infos dans la dataBase
function creasauces(req,res){
const {body, file} = req
const sauce = JSON.parse(body.sauce)
const {name, manufacturer, description, mainPepper, heat, userId} = sauce
const {filename} = file
function LofileName(req, filename){
    return req.protocol + "://" + req.get("host") + "/images/" + filename
}

const products = new product({ 
    userId: userId,
    name: name,
    manufacturer : manufacturer,
    description : description,
    mainPepper : mainPepper,
    imageUrl : LofileName(req, filename),
    heat : heat, 
    likes : "",
    dislikes : "", 
    usersLiked : [""], 
    usersDisliked : [""],})
    products
        .save()
        
        .then((products) => res.status(201).send({products}))
      
        .catch((err) => res.status(500).send(err))
}


function like(req, res, next) {
    const userId = req.body.userId;
    const liked = req.body.like;
    const { id } = req.params;
  
    product.findById(id)
      .then(product => {
        if (!product) return res.status(404).send({ message: "Product not found" });

        if (liked === 1) {
          product.usersLiked.push(userId);
          product.likes++;
        } else if (liked === 0) {
          product.usersLiked.splice(product.usersLiked.indexOf(userId), 1);
          if (product.likes > 0) {
            product.likes--;
          }
        } else if (liked === -1) {
          product.usersDisliked.push(userId);
          product.dislikes++;
        }
  
        if (liked === 0 && product.usersDisliked.includes(userId)) {
          product.usersDisliked.splice(product.usersDisliked.indexOf(userId), 1);
          if (product.dislikes > 0) {
            product.dislikes--;
          }
        }
        return product.save();
      })
      .then(product => res.status(200).send(product))
     }  
   

module.exports = {sauces, creasauces, getsauce, deleteSauce, modifierSauce, like}


   