/* ============================================================
   CONFIGURATION
============================================================ */

const URL_WORKER =
    "https://admin-rapports-depenses.xavier-37f.workers.dev";

const CHAMPS_PARAMETRES = [
    {
 	nom:"tauxKilometrage",
	etiquette: "Taux kilométrique",
	unite: "$ / km"
    },
    {
	nom: "dejeuner",
	etiquette: "Déjeuner",
	unite: "$"
    },
    {
	nom: "diner",
	etiquette: "Dîner",
	unite: "$"
    },
    {
	nom: "souper",
	etiquette: "Souper",
	unite: "$"
    },
    {
	nom: "collation",
	etiquette: "Collation",
	unite: "$"
    },
    {
	nom: "proches",
	etiquette: "Nuit chez des proches",
	unite: "$"
    }
];


/* ============================================================
   ÉLÉMENTS DU DOCUMENT
============================================================ */

const sectionConnexion =
    document.getElementById("sectionConnexion");

const sectionAdministration =
    document.getElementById("sectionAdministration");

const formulaireConnexion =
    document.getElementById("formulaireConnexion");

const motDePasse =
    document.getElementById("motDePasse");

const boutonConnexion =
    document.getElementById("boutonConnexion");

const boutonDeconnexion =
    document.getElementById("boutonDeconnexion");

const listeAnnees =
    document.getElementById("listeAnnees");

const avertissementAnnees =
    document.getElementById("avertissementAnnees");

const boutonAjouterAnnee =
    document.getElementById("boutonAjouterAnnee");

const boutonEnregistrer =
    document.getElementById("boutonEnregistrer");

const erreurConnexion =
    document.getElementById("erreurConnexion");

const messageAdministration =
    document.getElementById("messageAdministration");


/* ============================================================
   ÉLÉMENTS DE LA MODALE
============================================================ */

const modaleConfirmation =
    document.getElementById("modaleConfirmation");

const titreModale =
    document.getElementById("titreModale");

const texteModale =
    document.getElementById("texteModale");

const conteneurChampModale =
    document.getElementById("conteneurChampModale");

const etiquetteChampModale =
    document.getElementById("etiquetteChampModale");

const champModale =
    document.getElementById("champModale");

const erreurModale =
    document.getElementById("erreurModale");

const boutonAnnulerModale =
    document.getElementById("boutonAnnulerModale");

const boutonConfirmerModale =
    document.getElementById("boutonConfirmerModale");


/* ============================================================
   DONNÉES ET SESSION
============================================================ */

let jetonSession = null;
let donneesParametres = {};
let actionModale = null;

let modificationsNonEnregistrees = false;
const anneesNonEnregistrees = new Set();

let minuteurAvertissement = null;
let minuteurDeconnexion = null;

let avertissementInactiviteActif = false;

const DELAI_AVERTISSEMENT = 9 * 60 * 1000;
const DELAI_DECONNEXION = 10 * 60 * 1000;


/* ============================================================
   COMMUNICATION AVEC LE WORKER
============================================================ */

async function appelerWorker(
    chemin,
    options = {}
) {

    const headers = {
	...(options.headers || {})
    };

    if (
	jetonSession &&
	!chemin.endsWith("/login")
    ) {
	headers.Authorization =
	    `Bearer ${jetonSession}`;
    }

    const reponse = await fetch(
	`${URL_WORKER}${chemin}`,
	{
	    ...options,
	    headers
	}
    );

    let resultat;

    try {
	resultat = await reponse.json();
    } catch {
	throw new Error(
	    "Le serveur a retourné une réponse invalide."
	);
    }

    if (!reponse.ok) {

	throw new Error(
	    resultat.erreur ||
	    "Une erreur est survenue."
	);

    }

    return resultat;

}


/* ============================================================
   CONNEXION
============================================================ */

formulaireConnexion.addEventListener(
    "submit",
    async function (evenement) {

	evenement.preventDefault();
	erreurConnexion.hidden = true;
	boutonConnexion.disabled = true;
	boutonConnexion.textContent =
	    "Connexion en cours...";

	try {

	    const resultat = await appelerWorker(
		"/api/login",
		{
		    method: "POST",
		    headers: {
			"Content-Type": "application/json"
		    },
		    body: JSON.stringify({
			password: motDePasse.value
		    })
		}
	    );

	    jetonSession = resultat.token;

	    motDePasse.value = "";

	    await chargerParametres();

	    sectionConnexion.hidden = true;

	    sectionAdministration.hidden = false;

	    reinitialiserMinuteurInactivite();

	} catch (erreur) {

	    jetonSession = null;
 	    erreurConnexion.textContent =
		erreur.message;

	    erreurConnexion.hidden = false;

	} finally {

	    boutonConnexion.disabled = false;

 	    boutonConnexion.textContent =
		"Se connecter";

	}

    }

);


/* ============================================================
   DÉCONNEXION
============================================================ */

boutonDeconnexion.addEventListener(
    "click",
    function() {

	deconnecterUtilisateur();

    }

);


/* ============================================================
   CHARGER LES PARAMÈTRES DEPUIS GITHUB
============================================================ */

async function chargerParametres() {

    messageAdministration.textContent =
	"Chargement des paramètres...";

    try {

	const resultat = await appelerWorker(
	    "/api/params",
	    {
		method: "GET"
	    }
	);

	reinitialiserModificationsNonEnregistrees();

	donneesParametres = resultat.donnees;

	afficherAnnees();

	messageAdministration.textContent =
	    "Paramètres chargés depuis GitHub.";

	messageAdministration.className =
	    "message-administration succes";

    } catch (erreur) {

	throw erreur;

    }

}


/* ============================================================
   FORMATAGE DES MONTANTS
============================================================ */

function formaterMontant(valeur) {

    return Number(valeur).toLocaleString(
	"fr-CA",
	{
	    minimumFractionDigits: 2,
	    maximumFractionDigits: 2
	}
    ) + " $";

}

function lireMontant(valeur) {

    const texte = valeur
	.replace(/\s/g, "")
	.replace("$", "")
	.replace(",", ".");

    if (texte === "") {
	return "";
    }

    if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(texte)) {
	return valeur;
    }

    const nombre = Number(texte);

    return Number.isFinite(nombre)
	? nombre
	: valeur;

}


/* ============================================================
   MODIFICATIONS NON ENREGISTRÉES
============================================================ */

function signalerModificationsNonEnregistrees() {

    modificationsNonEnregistrees = true;

    avertissementAnnees.hidden = false;

    messageAdministration.textContent =
	"Modifications en attente d'enregistrement.";

    messageAdministration.className =
	"message-administration";

}

function reinitialiserModificationsNonEnregistrees() {

    modificationsNonEnregistrees = false;

    anneesNonEnregistrees.clear();

    avertissementAnnees.hidden = true;

}


/* ============================================================
   AFFICHER TOUTES LES ANNÉES
============================================================ */

function afficherAnnees() {

    listeAnnees.replaceChildren();

    const annees = Object.keys(donneesParametres)
	.sort((a, b) => Number(b) - Number(a));

    for (const annee of annees) {

	const carte = document.createElement("div");

	carte.className = "carte-annee";

 	if (anneesNonEnregistrees.has(annee)) {

	    carte.classList.add(
		"carte-annee-non-enregistree"
	    );

	}

	carte.dataset.annee = annee;


	/* EN-TÊTE DE L'ANNÉE */

	const entete = document.createElement("div");

	entete.className = "entete-annee";

	const titre = document.createElement("h3");

	titre.textContent = `Année ${annee}`;

	const boutonSupprimer =
	    document.createElement("button");

	boutonSupprimer.type = "button";

	boutonSupprimer.className =
	    "bouton bouton-danger";

	boutonSupprimer.textContent =
	    "Supprimer cette année";

	boutonSupprimer.addEventListener(
	    "click",
	    function() {
		demanderSuppressionAnnee(annee);
	    }
	);


	entete.append(
	    titre,
	    boutonSupprimer
	);


	/* GRILLE DES PARAMÈTRES */

	const grille = document.createElement("div");

	grille.className = "grille-parametres";


	for (const champ of CHAMPS_PARAMETRES) {

	    const conteneur = document.createElement("div");

	    conteneur.className = "champ";


	    const etiquette = document.createElement("label");

	    etiquette.textContent =
	  	`${champ.etiquette} (${champ.unite})`;

	    const identifiant =
		`parametre-${annee}-${champ.nom}`;

	    etiquette.htmlFor = identifiant;


	    const input = document.createElement("input");

	    input.type = "text";
	    input.id = identifiant;

 	    input.inputMode = "decimal";
	    input.autocomplete = "off";

	    const valeurInitiale =
	 	donneesParametres[annee][champ.nom];

	    input.value =
		typeof valeurInitiale === "number"
		    ? formaterMontant(valeurInitiale)
		    : valeurInitiale;


	    input.addEventListener(
		"focus",
		function() {

		    const valeur =
		    	donneesParametres[annee][champ.nom];

		    if (typeof valeur === "number") {

			input.value =
			    String(valeur).replace(".", ",");

		    }

		}
	    );

	    input.addEventListener(
		"input",
		function() {

		    donneesParametres[annee][champ.nom] =
			lireMontant(input.value);

		    signalerModificationsNonEnregistrees();

	 	}
	    );

	    input.addEventListener(
		"blur",
		function() {

		    const valeur =
			donneesParametres[annee][champ.nom];

		    if (typeof valeur === "number") {

			input.value =
			    formaterMontant(valeur);

		    }

		}
	    );

	    conteneur.append(
		etiquette,
		input
	    );

	    grille.appendChild(conteneur);

	}

	carte.append(
	    entete,
	    grille
	);

	listeAnnees.appendChild(carte);

    }

}


/* ============================================================
   MODALE
============================================================ */

function ouvrirModale(
    titre,
    texte,
    action,
    options = {}
) {

    titreModale.textContent = titre;

    texteModale.textContent = texte;

    actionModale = action;

    erreurModale.hidden = true;

    champModale.value = "";

    conteneurChampModale.hidden =
	!options.champ;

    if (options.champ) {

	etiquetteChampModale.textContent =
	    options.etiquette || "";

	champModale.min = options.min || "";

	champModale.max = options.max || "";

 	champModale.step = options.step || "1";

	champModale.placeholder =
	    options.placeholder || "";

    }

    boutonConfirmerModale.textContent =
	options.bouton || "Confirmer";

    modaleConfirmation.hidden = false;

    if (options.champ) {
	champModale.focus();
    } else {
	boutonConfirmerModale.focus();
    }

}


function fermerModale() {

    modaleConfirmation.hidden = true;

    actionModale = null;

    erreurModale.hidden = true;

}


/* ============================================================
   GESTION DE L'INACTIVITÉ
============================================================ */

function reinitialiserMinuteurInactivite() {

    if (!jetonSession || sectionAdministration.hidden) {
	return;
    }

    clearTimeout(minuteurAvertissement);
    clearTimeout(minuteurDeconnexion);


    minuteurAvertissement = setTimeout(
	afficherAvertissementInactivite,
	DELAI_AVERTISSEMENT
    );

    minuteurDeconnexion = setTimeout(
	deconnexionAutomatique,
	DELAI_DECONNEXION
    );

}

function afficherAvertissementInactivite() {

    if (!jetonSession || sectionAdministration.hidden) {
	return;
    }

    avertissementInactiviteActif = true;

    ouvrirModale(
	"Session bientôt expirée.",
	"Votre session prendra fin dans une minute en raison de l'inactivité.",
	function() {

	    avertissementInactiviteActif = false;

	    fermerModale();
  	
	    reinitialiserMinuteurInactivite();

	},
	{ 
	    bouton: "Rester connecté"
	}
    );

    boutonAnnulerModale.hidden = true;

}

function deconnexionAutomatique() {

    deconnecterUtilisateur(
	"Votre session a été fermée après 10 minutes d'inactivité."
    );

}

function deconnecterUtilisateur(message = "") {

    clearTimeout(minuteurAvertissement);
    clearTimeout(minuteurDeconnexion);

    avertissementInactiviteActif = false;

    jetonSession = null;

    donneesParametres = {};

    reinitialiserModificationsNonEnregistrees();

    listeAnnees.replaceChildren();

    messageAdministration.textContent = "";

    sectionAdministration.hidden = true;

    sectionConnexion.hidden = false;

    motDePasse.value = "";

    if (!modaleConfirmation.hidden) {
	fermerModale();
    }

    boutonAnnulerModale.hidden = false;

    erreurConnexion.textContent = message;

    erreurConnexion.hidden = !message;

    motDePasse.focus();

}

function gererActiviteUtilisateur(evenement) {

    if (!jetonSession || sectionAdministration.hidden) {
	return;
    }

    if (
	avertissementInactiviteActif &&
	!modaleConfirmation.contains(evenement.target)
    ) {
	
	avertissementInactiviteActif = false;

	fermerModale();

    }

    reinitialiserMinuteurInactivite();

}

boutonAnnulerModale.addEventListener(
    "click",
    fermerModale
);


boutonConfirmerModale.addEventListener(
    "click",
    async function() {

	if (!actionModale) {
	    return;
	}

	try {
	
	    await actionModale();

	} catch (erreur) {

	    erreurModale.textContent =
		erreur.message;

	    erreurModale.hidden = false;

	}

    }

);


document.addEventListener(
    "keydown",
    function (evenement) {

	if (
	    evenement.key === "Escape" &&
	    !modaleConfirmation.hidden &&
	    !avertissementInactiviteActif
	) {
	    fermerModale();
	}

    }

);


/* ============================================================
   AJOUTER UNE ANNÉE
============================================================ */

boutonAjouterAnnee.addEventListener(
    "click",
    function () {

	const annees = Object.keys(donneesParametres);

	if (annees.length === 0) {

	    messageAdministration.textContent =
		"Impossible d'ajouter une année : aucun paramètre n'a été chargé.";

	    messageAdministration.className =
		"message-administration erreur";

	    return;

	}

	const derniereAnnee = Math.max(
	    ...annees.map(Number)
	);

	const anneeProposee = derniereAnnee + 1;


	ouvrirModale(
	    "Ajouter une année",
	    "La nouvelle année sera créée avec six champs vides. Inscrivez les six montants avant de pouvoir enregistrer.",
	    ajouterAnnee,
	    {
		champ: true,
		etiquette: "Nouvelle année",
		min: "2000",
		max: "2100",
		step: "1",
		placeholder: anneeProposee.toString(),
		bouton: "Ajouter"
	    }
	);

	champModale.value = anneeProposee;

    }
);


function ajouterAnnee() {

    const annee = champModale.value.trim();

    if (!/^\d{4}$/.test(annee)) {

	throw new Error(
	    "Entre une année valide de quatre chiffres."
	);

    }

    if (
	Number(annee) < 2000 ||
 	Number(annee) > 2100
    ) {
	throw new Error(
	    "L'année doit être comprise entre 2000 et 2100."
	);

    }

    if (donneesParametres[annee]) {

	throw new Error(
	    "Cette année existe déjà."
	);

    }


    donneesParametres[annee] = {};

	for (const champ of CHAMPS_PARAMETRES) {

	    donneesParametres[annee][champ.nom] = "";

	}

	anneesNonEnregistrees.add(annee);

	signalerModificationsNonEnregistrees();


    afficherAnnees();

    fermerModale();

    messageAdministration.textContent =
	`L'année ${annee} a été ajoutée. Complétez les six montants avant de pouvoir enregistrer.`;

    messageAdministration.className =
	"message-administration";

}


/* ============================================================
   SUPPRIMER UNE ANNÉE
============================================================ */

function demanderSuppressionAnnee(annee) {

    const nombreAnnees =
	Object.keys(donneesParametres).length;

    if (nombreAnnees <= 1) {

	messageAdministration.textContent =
	    "Impossible de supprimer la dernière année restante.";

	messageAdministration.className =
	    "message-administration erreur";

	return;

    }


    ouvrirModale(
	"Supprimer une année",
	`Voulez-vous vraiment supprimer l'année ${annee} et ses six paramètres? Cette suppression sera appliquée seulement lorsque les modifications auront été enregistrées.`,
	function () {

	    delete donneesParametres[annee];

	    anneesNonEnregistrees.delete(annee);

  	    signalerModificationsNonEnregistrees();

	    afficherAnnees();

	    fermerModale();

	    messageAdministration.textContent =
		`L'année ${annee} a été supprimée. N'oubliez pas d'enregistrer les modifications.`;

	    messageAdministration.className =
		"message-administration";

	},
	{
	    bouton: "Supprimer"
	}
    );

}


/* ============================================================
   VALIDER LES PARAMÈTRES
============================================================ */

function validerParametres() {

    const annees = Object.keys(donneesParametres);

    if (annees.length === 0) {

	throw new Error(
	    "Il faut conserver au moins une année."
	);

    }

    for (const annee of annees) {

	if (!/^\d{4}$/.test(annee)) {

	    throw new Error(
		`L'année ${annee} est invalide.`
	    );

	}

	for (const champ of CHAMPS_PARAMETRES) {

	    const valeur =
		donneesParametres[annee][champ.nom];

	    if (
		typeof valeur !== "number" ||
		!Number.isFinite(valeur) ||
		valeur <= 0
	    ) {

		const inputInvalide = document.getElementById(
		    `parametre-${annee}-${champ.nom}`
		);

		if (inputInvalide) {
		    inputInvalide.focus();
		}

		throw new Error(
		    `Le champ « ${champ.etiquette} » de l'année ${annee} doit contenir un montant supérieur à 0 $.`
		);

	    }

	}

    }

}


/* ============================================================
   ENREGISTRER DANS GITHUB
============================================================ */

boutonEnregistrer.addEventListener(
    "click",
    function () {

	try {
	    validerParametres();

	} catch (erreur) {

	    messageAdministration.textContent =
		erreur.message;

	    messageAdministration.className =
		"message-administration erreur";

	    return;

 	}

	ouvrirModale(
	    "Confirmer l'enregistrement",
	    "Les paramètres financiers seront enregistrés directement dans le fichier parametres.js de GitHub. Les valeurs actuelles seront remplacées.",
	    enregistrerParametres,
	    {
		bouton: "Enregistrer"
	    }
	);

    }
);


async function enregistrerParametres() {

    validerParametres();

    boutonConfirmerModale.disabled = true;

    boutonConfirmerModale.textContent =
	"Enregistrement...";

    try {

	await appelerWorker(
	    "/api/params",
	    {
		method: "PUT",
		headers: {
		    "Content-Type": "application/json"
		},
		body: JSON.stringify({
		    donnees: donneesParametres
		})
	    }
	);

	fermerModale();

	reinitialiserModificationsNonEnregistrees();

	afficherAnnees();

	messageAdministration.textContent =
	    "Les paramètres ont été enregistrés avec succès.";

	messageAdministration.className =
	    "message-administration succes";

    } catch (erreur) {

	throw erreur;

    } finally {

	boutonConfirmerModale.disabled = false;

	boutonConfirmerModale.textContent =
	    "Enregistrer";

    }

}