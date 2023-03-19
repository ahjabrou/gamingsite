const express = require('express');
const router = express.Router();
let con = require ('../data');//deux points devant data parce que le fichir
// data.js se trouve hors du dossier routes où se trouve le fichier index.js

// router.get('/', (req, res) => {
//     res.render('index');
//   });

router.get('/', (req, res) => {
  res.render('index', {session:req.session});
});

router.get('/accueil', (req, res) => {
  res.render('accueil', { session: req.session });
});

  // router.get('/accueil', (req, res) => {
  //   res.render('accueil');
  // });
  router.get('/about', (req, res) => {
    res.render('about', { session: req.session });
  });
  router.get('/mesjeux', (req, res) => {
    res.render('mesjeux', { session: req.session });
  });
  router.get('/inscrire', (req, res) => {
    const messages = req.flash();
    res.render('inscrire',{ messages, session: req.session });
  });

  // on ajoute session: req.session à cause du fichier index.ejs ajouté en include, ce
  //fichier a des paramètres précisant quelle action doit être effectuée si l'utilistaeur
  //est connecté grâce à une session

  router.get('/memory_details', (req, res) => {
    res.render('memory_details',{ session: req.session });
  });

  router.get('/connect', (req, res) => {
    const messages = req.flash();
    res.render('connecter', { messages, session: req.session });
  });


  //////////page de profil//////////
  router.get('/profil', (req, res) => {
	const userId = req.session.utilisateurId;
  
	if (!userId) {
	  res.redirect('/connect');
	  return;
	}
  
	const sql = 'SELECT * FROM gaming WHERE id = ?';
	con.query(sql, [userId], (error, results) => {
	  if (error) {
		console.error(error);
		res.status(500).send('Erreur lors de la récupération du profil');
		return;
	  }
  
	  const user = results[0];
	  res.render('profil', { user, session: req.session });
	});
  });
////////end//////////
  

router.get('/telecharger', function(req, res) {
  // Vérifier si l'utilisateur est connecté
  if (!req.session.utilisateurId) {
    // Rediriger l'utilisateur vers la page de connexion
    return res.redirect('/connect');
  }

  // Créer un tableau de fichiers à télécharger avec leur nom et ID
  const filesToDownload = [
    { name: 'memory.apk', id: '1XlSd1HayVCTzy0Z7ZqBACf9ILL42MYJm' },
    { name: 'jeu2.exe', id: 'YOUR_FILE_ID_2' },
    { name: 'jeu3.exe', id: 'YOUR_FILE_ID_3' }
  ];

  // Générer les liens de téléchargement direct vers les fichiers Google Drive
  const fileUrls = filesToDownload.map(file => {
    return {
      name: file.name,
      url: `https://drive.google.com/uc?export=download&id=${file.id}`
    };
  });

  // Rendre la page de téléchargement des fichiers
  res.render('telecharger', { files: fileUrls, session: req.session });
  // for (const fileUrl of fileUrls) {
  //   res.redirect(fileUrl.url);
  // }
});



  //route de déconnexion
  router.get('/deconnexion', (req, res) => {
    req.session.destroy();
    res.redirect("/accueil");
  });

module.exports = router;