// server.js (le fichier principal serveur)
const config = require('./config');
const express = require('express');
require('dotenv').config()
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const ejs = require ('ejs');
const mysql = require('mysql');
let con = require ('./data');//un point devant data parce que le fichier
// data.js se trouve dans le même endroit que le fichier server.js

app.set('secretKey', config.cleSecrete);
console.log(config.cleSecrete); // affiche la clé secrète générée

app.use(session({
	secret: config.cleSecrete,
	resave: false,
  saveUninitialized: true,
	cookie: { secure: false } // si HTTPS est activé, mettre à true
  }));

const body_parser = require('body-parser');

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

//initialisons flash pour l'utiliser pour afficher les messages d'erreur et de succès
app.use(flash());

//ces variables permet d'accéder aux routes dans le fichier index js et à la connexion de la base de données dans data.js
//moi j'ai nommé indexRouter parce que les routes se trouvent dans le fichier index.js
const indexRouter = require('./routes/index');


//permet de lire les fichiers ejs sans leurs extensions
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



//voici comment on appelle nos routes qui sont le fichier index.js
app.use('/', indexRouter);
app.use('/accueil', indexRouter);
app.use('/mesjeux', indexRouter);
app.use('/about', indexRouter);
app.use('/memory_details', indexRouter);
app.use('/inscrire', indexRouter);
app.use('/profil', indexRouter);
app.use('/telecharger', indexRouter);
app.use('/deconnexion', indexRouter);

//pour afficher les messages d'erreur flash
app.use(function(request, response, next) {
	response.locals.flash = request.flash();
	next();
  });
  

//inscription de l'utilisateur
app.post('/insert', (request, response) => {
    const pseudo = request.body.pseudo;
    const email = request.body.email;
    const pass = request.body.pass;
    const profil = request.body.profil;
    
    const sql = 'INSERT INTO gaming (pseudo, email, pass, profil) VALUES (?, ?, ?, ?)';
    con.query(sql, [pseudo, email, pass, profil], (error, results, fields) => {
        if (error) {
            console.error(error);
            response.status(500).send('Erreur lors de l\'insertion de l\'utilisateur');
        } else {
            console.log('Utilisateur inséré avec succès');
            request.flash ('success', 'Utilisateur inséré avec succès');
            response.redirect('/connect');
        }
    });
});

  
  //connexion de l'utilisateur
  app.post('/connecter', (request, response) => {
	const email = request.body.email;
	const pass = request.body.pass;
  
	const sql = 'SELECT * FROM gaming WHERE email = ?';
	con.query(sql, [email], (error, results, fields) => {
	  if (error) {
		console.error(error);
		request.flash('error', 'Erreur lors de la connexion');
		response.redirect('/connect');
	  } else if (results.length === 0) {
		request.flash('error', 'Email ou mot de passe invalide');
		response.redirect('/connect');
	  } else {
		const utilisateur = results[0];
  
		if (pass !== utilisateur.pass) {
		  request.flash('error', 'Email ou mot de passe invalide');
		  response.redirect('/connect');
		} else {
		  request.session.utilisateurId = utilisateur.id;
		  request.session.utilisateurPseudo = utilisateur.pseudo;
		  request.session.utilisateurProfil = utilisateur.profil;
		  request.flash('success', 'Utilisateur connecté!');
		  response.redirect('/accueil');
		}
	  }
	});
  });

//recup session utilisateur
  app.get('/utilisateur', (req, res) => {
	const utilisateurId = req.session.utilisateurId;
  
	if (!utilisateurId) {
	  res.status(401).send('Utilisateur non connecté');
	} else {
	  const sql = 'SELECT pseudo, profil FROM gaming WHERE id = ?';
	  con.query(sql, [utilisateurId], (error, results, fields) => {
		if (error) {
		  console.error(error);
		  res.status(500).send('Erreur lors de la récupération des données de l\'utilisateur');
		} else {
		  const utilisateur = results[0];
		  res.send(utilisateur);
		}
	  });
	}
  });
  

  
app.listen(PORT);