// Importation express + cors + utilisation du port
console.log("hello World")
//On importe le framework Express pour la création d'applications Web
const express = require("express")

//On crée une instance de l'application Express nommé app
const app = express()

//On importe le middleware Body-Parser pour faciliter la gestion des données envoyées à partir de formulaires HTML
const bodyParser = require("body-parser");

// Path est importé de la bibliothéque Node.js, elle fournit des fonction pour travailler avec les chemins de fichiers
const path = require("path")


//Définit le port de l'application
const port = 3000


// DATA BASE + CONTROLLER

// On importe le fichier mongoose, qui permet de se connecter a la base de donné
require("./mongoose")

// Importation des controleurs depuis le fichier user.js
const {Userc, logUser} = require("./user")
const {sauces} = require("./sauces")

// Controleur pour opération CRUD
const {creasauces, getsauce,  deleteSauce, modifierSauce, like} = require("./sauces")

// On ajoute un middleware qui définit les en-têtes HTTP pour permettre l'accès à partir de sources externes.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

// Injection Middleware
//sapp.use(cors());

// On ajoute le middleware Express pour traiter les donnés envoyées en tant que JSON
app.use(express.json())

// On ajoute le middleware BodyParser pour traiter les données envoyées a partir des formulaire HTML
app.use(bodyParser.json())

// On ajoute Express pour gerer les fichier statiques(images)
app.use(express.static("/images"))

// On ajoute le middleware Multer pour les télechargement de fichiers 
const multer = require("multer")

const storage = multer.diskStorage({destination: "images/", filename: function(req, file, cb){
    cb(null, LofileName(req, file))
    }
})


/*Fonction qui permet de génere un nom de fichier unique pour chaque image télelchargée*/
function LofileName(req, file, cb){
    const filename = `${Date.now()}-${file.originalname}`.replace(/\s/g,"-")
    file.filename = filename
    return filename
}
// On définit l'instance de multer qui utilise la configuration define dans la constante storage
const upload = multer({storage: storage})


// Création des Routes
app.post("/api/auth/signup", Userc) 
app.post("/api/auth/login", logUser)
app.get("/api/sauces", sauces)
app.post("/api/sauces",  upload.single("image"),  creasauces)
app.get("/api/sauces/:id", getsauce )
app.delete("/api/sauces/:id", deleteSauce)
app.put("/api/sauces/:id", modifierSauce)
app.post("/api/sauces/:id/like", like)
app.get("/", (req, res) => res.send("hello World ! "))


app.use("/images", express.static(path.join(__dirname,"images")))
app.listen(port,() => console.log("listening on port" + port))

