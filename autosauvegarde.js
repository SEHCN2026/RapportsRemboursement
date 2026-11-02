/* ============================================================
   FORMULAIRE B — SAUVEGARDE AUTOMATIQUE
============================================================ */

(() => {
    "use strict";

    const estFormulaireA = Boolean(
	document.getElementById("dateDepart") &&
	document.getElementById("dateRetour")
    );

    const CLE_BROUILLON_B = "formulaireB_brouillon_v1";

    const CLE_BROUILLON = estFormulaireA
	? "formulaireA_brouillon_v1"
	: CLE_BROUILLON_B;

    const DELAI_SAUVEGARDE = 500;

    const formulaire = document.getElementById("contenuFormulaire");
    const fenetreBrouillon = document.getElementById("fenetreBrouillon");
    const statut = document.getElementById("statutAutosauvegarde");

    const boutonReprendre =
	document.getElementById("boutonReprendreBrouillon");

    const boutonNouvelleDemande =
	document.getElementById("boutonNouvelleDemande");

    if (!formulaire || !fenetreBrouillon || !statut) {
	console.error(
	    "Sauvegarde automatique: éléments HTML introuvables."
	);
	return;
    }

    let minuterieSauvegarde = null;
    let restaurationEnCours = false;
    let sauvegardeActive = false;


    /* --------------------------------------------------------
       ACCÈS À LOCALSTORAGE
    -------------------------------------------------------- */

    function lireBrouillon() {
    	try {
	    const contenu = localStorage.getItem(CLE_BROUILLON);

	    if (!contenu) {
		return null;
	    }

	    const brouillon = JSON.parse(contenu);

 	    if (
		!brouillon ||
		typeof brouillon.champs !== "object" ||
		brouillon.champs === null
	    ) {
		return null;
	    }

	    return brouillon;

 	} catch (erreur) {
	    console.error("Lecture du brouillon impossible :", erreur);
	    return null;
	}
    }


    /* --------------------------------------------------------
       COLLECTE DES CHAMPS
    -------------------------------------------------------- */

    function collecterChamps() {
	const champs = {};

	const elements = formulaire.querySelectorAll(
	    "input, select, textarea"
	);

	elements.forEach((element, index) => {
	    if (
		element.type === "file" ||
		element.type === "button" ||
		element.type === "submit" ||
		element.type === "reset"
	    ) {
		return;
	    }

	    const cle = element.id || element.name;

	    if (!cle) {
		return;
	    }

            /*
             * Les champs doivent avoir un identifiant unique.
             * On utilise un tableau pour permettre plusieurs champs
             * portant le même identifiant de groupe (ex. radios).
             */

	    if (!champs[cle]) {
		champs[cle] = [];
	    }

	    const donnee = {
		index: index,
		type: element.type,
		valeur: element.value
	    };

	    if (
		element.type === "checkbox" ||
		element.type === "radio"
	    ) {
		donnee.coche = element.checked;
	    }

	    champs[cle].push(donnee);
	});

	return champs;
    }


    /* --------------------------------------------------------
       SAUVEGARDE
    -------------------------------------------------------- */

    function sauvegarderBrouillon() {
	if (!sauvegardeActive || restaurationEnCours) {
	    return;
	}

	statut.textContent = "Enregistrement en cours ...";

	const brouillon = {
	    version: 1,
	    dateSauvegarde: new Date().toISOString(),
	    champs: collecterChamps()
	};

	try {
	    localStorage.setItem(
		CLE_BROUILLON,
		JSON.stringify(brouillon)
	    );

	    statut.textContent = "Progression enregistrée!";

	} catch (erreur) {
	    console.error("Sauvegarde impossible :", erreur);

	    statut.textContent =
		"La sauvegarde a échoué. Vérifiez l'espace disponible.";

	}
    }

    function programmerSauvegarde() {
	if (!sauvegardeActive || restaurationEnCours) {
	    return;
	}

	statut.textContent = "Modification en attente...";

	clearTimeout(minuterieSauvegarde);

	minuterieSauvegarde = setTimeout(
	    sauvegarderBrouillon,
	    DELAI_SAUVEGARDE
	);
    }

    /* --------------------------------------------------------
       LECTURE D'UNE VALEUR SAUVEGARDÉE PAR IDENTIFIANT
    -------------------------------------------------------- */

    function obtenirValeurSauvegardee(champs, id) {
	const donnees = champs[id];

	if (!Array.isArray(donnees) || donnees.length === 0) {
	    return "";
	}

	return donnees[0].valeur ?? "";

    }


    /* --------------------------------------------------------
       RESTAURATION SPÉCIFIQUE — FORMULAIRE A
    -------------------------------------------------------- */

    function restaurerChampsFormulaireA(champsSauvegardes) {
	restaurationEnCours = true;

	try {

        // ----------------------------------------------------
        // 1. RESTAURER LES DATES AVANT DE CRÉER LES JOURNÉES
        // ----------------------------------------------------

	const dateDepart = obtenirValeurSauvegardee(
	    champsSauvegardes,
	    "dateDepart"
	);

	const dateRetour = obtenirValeurSauvegardee(
	    champsSauvegardes,
	    "dateRetour"
	);

	function restaurerDate(id, valeur) {
	    const champ = document.getElementById(id);

	    if (!champ) {
	 	return;
	    }

	    if (champ._flatpickr) {
		if (valeur) {
		    champ._flatpickr.setDate(
			valeur,
			false,
			"Y-m-d"
		    );
		} else {
		    champ._flatpickr.clear();
		}
	    } else {
		champ.value = valeur;
	    }
	}

	restaurerDate("dateDepart", dateDepart);
	restaurerDate("dateRetour", dateRetour);


        // ----------------------------------------------------
        // 2. RECRÉER LES JOURNÉES À PARTIR DES DATES
        // ----------------------------------------------------

	if (typeof window.creerJournees === "function") {
	    window.creerJournees();
	}

	const pieces = document.getElementById(
	    "piecesJustificatives"
	);

	if (pieces) {
	    pieces.disabled = !dateDepart;
	}

	const affichageDateDepart = document.getElementById(
	    "dateDepartAffichee"
	);

	if (affichageDateDepart) {
	    affichageDateDepart.textContent = dateDepart
		? new Date(
		    dateDepart + "T00:00:00"
		).toLocaleDateString("fr-CA", {
			day: "numeric",
			month: "long",
			year: "numeric"
		})
		: "";
	}


        // ----------------------------------------------------
        // 2B. RECRÉER LES LIGNES DE TRANSPORT PUBLIC
        //     PRÉSENTES DANS LE BROUILLON
        // ----------------------------------------------------

        const nombreJourneesTransport =
            document.querySelectorAll(
                "#conteneurJournees section"
            ).length;

        for (
            let journee = 1;
            journee <= nombreJourneesTransport;
            journee++
        ) {

            const expression = new RegExp(
                "^montantTransportPublic" +
                journee +
                "_(\\d+)$"
            );

            const numerosLignes =
                Object.keys(champsSauvegardes)
                    .map(cle => {
                        const resultat = cle.match(expression);

                        return resultat
                            ? Number(resultat[1])
                            : null;
                    })
                    .filter(numero => numero !== null)
                    .filter(numero => numero > 1)
                    .sort((a, b) => a - b);

            const conteneur =
                document.getElementById(
                    "conteneurTransportsPublics" + journee
                );

            const bouton =
                document.querySelector(
                    '.bouton-ajouter-transport[data-journee="' +
                    journee +
                    '"]'
                );

            if (!conteneur || !bouton) {
                continue;
            }

            numerosLignes.forEach(numeroVoulu => {

                const idMontantVoulu =
                    "montantTransportPublic" +
                    journee +
                    "_" +
                    numeroVoulu;

                // La ligne existe déjà : rien à recréer.
                if (document.getElementById(idMontantVoulu)) {
                    return;
                }

                // Ajouter une ligne avec le mécanisme existant.
                bouton.click();

                const lignes =
                    conteneur.querySelectorAll(
                        ".transport-public-ligne"
                    );

                const nouvelleLigne = lignes[lignes.length - 1];

                if (!nouvelleLigne) {
                    return;
                }

                const champMontant =
                    nouvelleLigne.querySelector(
                        '[id^="montantTransportPublic' +
                        journee +
                        '_"]'
                    );

                if (!champMontant) {
                    return;
                }

                const correspondance =
                    champMontant.id.match(/_(\d+)$/);

                if (!correspondance) {
                    return;
                }

                const numeroGenere =
                    Number(correspondance[1]);

                // Le numéro généré est déjà le bon.
                if (numeroGenere === numeroVoulu) {
                    return;
                }

                // Renommer les identifiants et références
                // de la ligne pour respecter le brouillon.
                const expressionSuffixe = new RegExp(
                    "_" + numeroGenere + "$"
                );

                nouvelleLigne
                    .querySelectorAll("[id], [name], [for]")
                    .forEach(element => {

                        ["id", "name", "for"].forEach(attribut => {

                            if (!element.hasAttribute(attribut)) {
                                return;
                            }

                            const valeur =
                                element.getAttribute(attribut);

                            if (valeur) {
                                element.setAttribute(
                                    attribut,
                                    valeur.replace(
                                        expressionSuffixe,
                                        "_" + numeroVoulu
                                    )
                                );
                            }
                        });
                    });
            });
        }


        // ----------------------------------------------------
        // 3. RESTAURER LES VALEURS DES CHAMPS
        //    PAR LEUR IDENTIFIANT, ET NON PAR LEUR INDEX
        // ----------------------------------------------------

	const elements = Array.from(
	    formulaire.querySelectorAll(
		"input, select, textarea"
	    )
	);

	elements.forEach(element => {
	    if (element.type === "file") {
		element.value = "";
		return;
	    }

	    if (
		element.type === "button" ||
		element.type === "submit" ||
		element.type === "reset"
	    ) {
		return;
	    }

	    const cle = element.id || element.name;

	    if (
		!cle ||
		cle === "dateDepart" ||
		cle === "dateRetour"
	    ) {
		return;
	    }

	    const donnees = champsSauvegardes[cle];

	    if (!Array.isArray(donnees) || donnees.length === 0) {
		return;
	    }

	    const donnee = donnees[0];

	    if (
		element.type === "checkbox" ||
		element.type === "radio"
	    ) {
		element.checked = Boolean(donnee.coche);
	    } else {
		element.value = donnee.valeur ?? "";
	    }

	});


        // ----------------------------------------------------
        // 4. RÉACTIVER LES COMPORTEMENTS CONDITIONNELS
        // ----------------------------------------------------

	elements.forEach(element => {
	    if (
		element.type === "file" ||
		element.type === "button" ||
		element.type === "submit" ||
		element.type === "reset"
	    ) {
		return;
	    }

	    const cle = element.id || element.name;

	    if (
		!cle ||
		cle === "dateDepart" ||
		cle === "dateRetour" ||
		!Array.isArray(champsSauvegardes[cle])
	    ) {
		return;
	    }

	    let typeEvenement = "input";

	    if (
		element.type === "checkbox" ||
		element.type === "radio" ||
		element.type === "time" ||
		element.tagName === "SELECT"
	    ) {
		typeEvenement = "change";
	    }

	    element.dispatchEvent(
		new Event(typeEvenement, {
		    bubbles: true
		})
	    );
	});


        // ----------------------------------------------------
        // 5. ACTUALISER LES REPAS ET LES TOTAUX
        // ----------------------------------------------------

	const nombreJournees = document.querySelectorAll(
	    "#conteneurJournees section"
	).length;

	for (let i = 1; i <= nombreJournees; i++) {
	    if (typeof window.verifierRepas === "function") {
		window.verifierRepas(i);
	    }

	    if (
		typeof window.calculerTotalJournee === "function"
	    ) {
		window.calculerTotalJournee(i);
	    }
	}

	if (
	    typeof window.verifierChampsObligatoires === "function"
	) {
	    window.verifierChampsObligatoires();
	}

	restaurerPiecesJustificatives();

    } finally {
	restaurationEnCours = false;
    }
}





    /* --------------------------------------------------------
       RESTAURATION DES CHAMPS
    -------------------------------------------------------- */

    function restaurerChamps(champsSauvegardes) {

	if (estFormulaireA) {
	    restaurerChampsFormulaireA(champsSauvegardes);
	    return;
	}

	restaurationEnCours = true;

	try {

    	    // --------------------------------------------------------
    	    // FORMULAIRE B — RECRÉER LES ARRÊTS INTERMÉDIAIRES
    	    // --------------------------------------------------------

	    if (!estFormulaireA) {

	  	const conteneurAller =
		    document.getElementById("conteneurArretsAller");

	  	const conteneurRetour =
		    document.getElementById("conteneurArretsRetour");

	  	const boutonAjouterAller =
		    document.getElementById("ajouterArretAller");

	  	const boutonAjouterRetour =
		    document.getElementById("ajouterArretRetour");

		if (conteneurRetour) {
		    conteneurRetour.innerHTML = "";
		}

		if (conteneurAller) {
		    conteneurAller.innerHTML = "";
		}


		const donneesAller =
		    champsSauvegardes["villeArretAller[]"] || [];

		const donneesRetour =
		    champsSauvegardes["villeArretRetour[]"] || [];


		if (boutonAjouterAller) {
		    donneesAller.forEach(function() {
			boutonAjouterAller.click();
		    });
		}


		if (boutonAjouterRetour) {
		    donneesRetour.forEach(function() {
			boutonAjouterRetour.click();
		    });
		}

	    }




        // --------------------------------------------------------
        // FORMULAIRE B — RECRÉER LES LIGNES DE TRANSPORT PUBLIC
        // --------------------------------------------------------

	const conteneurTransportsPublics =
	    document.getElementById("conteneurTransportsPublics");

	const boutonAjouterTransport =
	    document.querySelector(".bouton-ajouter-transport");

	if (conteneurTransportsPublics && boutonAjouterTransport) {

	    const numerosTransports = Object.keys(champsSauvegardes)
		.map(function(cle) {

		    const resultat = cle.match(
			/^(?:type|montant)TransportPublic_(\d+)$/
		    );

		    return resultat
			? Number(resultat[1])
			: null;
		})
		.filter(numero => numero !== null);

	    const dernierNumero = Math.max(
		1,
		...numerosTransports
	    );

	    for(
		let numero = 2;
		numero <= dernierNumero;
		numero++
	    ) {

		const idMontant =
		    "montantTransportPublic_" + numero;

		if (
		    !document.getElementById(idMontant)
		) {
		    boutonAjouterTransport.click();
		}
	    }
	}


	    const elements = Array.from(
		formulaire.querySelectorAll(
		    "input, select, textarea"
		)
	    );

	    elements.forEach((element, index) => {
		if (element.type === "file") {
		    element.value = "";
		    return;
		}

		const cle = element.id || element.name;

		if (!cle || !champsSauvegardes[cle]) {
		    return;
		}

		const champsDeMemeNom = elements
		    .slice(0, index)
		    .filter(function(autreElement) {
			return (autreElement.id || autreElement.name) === cle;
		    }).length;

		const donneesSauvegardees = champsSauvegardes[cle];

		const donnee = donneesSauvegardees[champsDeMemeNom];

		if (!donnee) {
		    return;
		}

		if (
		    element.type === "checkbox" ||
		    element.type === "radio"
		) {
		    element.checked = Boolean(donnee.coche);
		} else {
		    element.value = donnee.valeur ?? "";
		}
	    });

	    const champDate = document.getElementById("dateActivite");

	    if (champDate && champDate._flatpickr) {
		if (champDate.value) {
		    champDate._flatpickr.setDate(
			champDate.value,
			false,
			"Y-m-d"
		    );
		} else {
		    champDate._flatpickr.clear();
		}
	    }

	    restaurerPiecesJustificatives();

	    recalculerFormulaire();

	    if (
		!estFormulaireA &&
		typeof window.gererTypeTrajet === "function"
	    ) {
		window.gererTypeTrajet();
	    }

	} finally {
	    restaurationEnCours = false;
	}

    }


    /* --------------------------------------------------------
       PIÈCES JUSTIFICATIVES
    -------------------------------------------------------- */

    function restaurerPiecesJustificatives() {
	const champFichiers =
	    document.getElementById("piecesJustificatives");

	if (champFichiers) {
	    champFichiers.value = "";
	    champFichiers._fichiersSelectionnes = [];
	}

	const liste =
	    document.getElementById("listePiecesJustificatives");

	if (liste) {
	    liste.replaceChildren();
	}

	const resume = document.getElementById("resumeFichiers");

	if (resume) {
	    resume.textContent = "";
	}
    }


    /* --------------------------------------------------------
       RECALCULS APRÈS RESTAURATION
    -------------------------------------------------------- */

    function recalculerFormulaire() {
        /*
         * L'ordre est important : on remet d'abord les champs
         * conditionnels dans leur état approprié, puis les totaux.
         */

  	if (typeof window.verifierRepas === "function") {
	    window.verifierRepas();
	}

  	if (typeof window.afficherMontantRepas === "function") {
	    window.afficherMontantRepas();
	}

  	if (typeof window.verifierRepas === "function") {
	    window.verifierRepas();
	}

  	if (typeof window.mettreAJourLocationEssence === "function") {
	    window.mettreAJourLocationEssence();
	}

  	if (typeof window.calculerKilometrage === "function") {
	    window.calculerKilometrage();
	}

  	if (typeof window.calculerAutresTransports === "function") {
	    window.calculerAutresTransports();
	}

  	if (typeof window.calculerTotalRepas === "function") {
	    window.calculerTotalRepas();
	}

  	if (typeof window.calculerAutresDepenses === "function") {
	    window.calculerAutresDepenses();
	}

  	if (typeof window.calculerTotalJournee === "function") {
	    window.calculerTotalJournee();
	}

  	if (typeof window.verifierChampsObligatoires === "function") {
	    window.verifierChampsObligatoires();
	}
    }


    /* --------------------------------------------------------
       NOUVELLE DEMANDE
    -------------------------------------------------------- */

    function commencerNouvelleDemande() {
	fenetreBrouillon.classList.remove("active");
	fenetreNouvelleDemande.classList.add("active");
    }


    const fenetreNouvelleDemande =
	document.getElementById("fenetreNouvelleDemande");

    const boutonAnnulerNouvelleDemande =
	document.getElementById("boutonAnnulerNouvelleDemande");

    const boutonConfirmerNouvelleDemande =
	document.getElementById("boutonConfirmerNouvelleDemande");


    boutonAnnulerNouvelleDemande.addEventListener("click", function() {
	fenetreNouvelleDemande.classList.remove("active");

	reprendreBrouillon();
    });


    boutonConfirmerNouvelleDemande.addEventListener("click", function() {
	clearTimeout(minuterieSauvegarde);



	try {
	    localStorage.removeItem(CLE_BROUILLON);
	 
 	    fenetreBrouillon.classList.remove("active");
	    fenetreNouvelleDemande.classList.remove("active");

	    sauvegardeActive = true;

	    statut.textContent = "Nouvelle demande";


	    if (typeof window.reinitialiserFormulaire === "function") {
		window.reinitialiserFormulaire();
	    }


	} catch (erreur) {
	    console.error("Suppression du brouillon impossible :", erreur);

	    fenetreNouvelleDemande.classList.remove("active");

	    statut.textContent =
	 	"Impossible de supprimer le brouillon précédent.";
	}
    });


    /* --------------------------------------------------------
       REPRISE DU BROUILLON
    -------------------------------------------------------- */

    function reprendreBrouillon() {
	const brouillon = lireBrouillon();

	if (!brouillon) {
	    fenetreBrouillon.classList.remove("active");
	    sauvegardeActive = true;
	    statut.textContent = "Aucun brouillon à reprendre";
	    return;
	}

	restaurerChamps(brouillon.champs);

	fenetreBrouillon.classList.remove("active");

	sauvegardeActive = true;

 	statut.textContent = "Brouillon repris";

	sauvegarderBrouillon();
    }


    /* --------------------------------------------------------
       MIGRATION D'UN ANCIEN BROUILLON A
    -------------------------------------------------------- */

    function migrerAncienBrouillonA() {
    	if(!estFormulaireA) {
	    return;
	}

	try {
	    if (localStorage.getItem(CLE_BROUILLON)) {
		return;
	    }

	    const ancienContenu = localStorage.getItem(
		CLE_BROUILLON_B
	    );

	    if (!ancienContenu) {
		return;
	    }

	    const ancienBrouillon = JSON.parse(ancienContenu);
	    const champs = ancienBrouillon?.champs;

	    if (
		!champs ||
		(
		    !Array.isArray(champs.dateDepart) &&
		    !Array.isArray(champs.dateRetour)
		)

	    ) {
		return;
	    }

	    localStorage.setItem(
		CLE_BROUILLON,
		ancienContenu
	    );

	} catch (erreur) {
	    console.error(
		"Migration du brouillon A impossible :",
		erreur
	    );
	}
    }


    /* --------------------------------------------------------
       INITIALISATION
    -------------------------------------------------------- */

    formulaire.addEventListener("input", programmerSauvegarde);
    formulaire.addEventListener("change", programmerSauvegarde);

    if (boutonReprendre) {
	boutonReprendre.addEventListener("click", reprendreBrouillon);
    }

    if (boutonNouvelleDemande) {
	boutonNouvelleDemande.addEventListener(
	    "click",
	    commencerNouvelleDemande
	);
    }

    if (typeof window.reinitialiserFormulaire === "function") {
	const reinitialiserOriginal = window.reinitialiserFormulaire;

	window.reinitialiserFormulaire = function (...args) {
	    const resultat = reinitialiserOriginal.apply(this, args);

		if (!estFormulaireA) {
		    const trajetDirect =
			document.getElementById(
			    "trajetDirect"
			);

		    const trajetAvecArrets =
			document.getElementById(
			    "trajetAvecArrets"
			);

		    if (trajetDirect) {
			trajetDirect.checked = true;
		    }

		    if (trajetAvecArrets) {
			trajetAvecArrets.checked = false;
		    }

		    if (typeof window.gererTypeTrajet === "function") {
			window.gererTypeTrajet();
		    }
		}

	    clearTimeout(minuterieSauvegarde);

	    try {
		localStorage.removeItem(CLE_BROUILLON);
		statut.textContent = "Nouvelle demande";
	    } catch (erreur) {
		console.error(
		    "Suppression du brouillon impossible :",
		    erreur
		);
	    }

	    return resultat;
	};
    }


    /*
     * Vérifier s'il existe un brouillon au démarrage.
     */

    migrerAncienBrouillonA();

    const brouillonExistant = lireBrouillon();

    if (brouillonExistant) {
	sauvegardeActive = false;
	fenetreBrouillon.classList.add("active");
    } else {
	sauvegardeActive = true;
	statut.textContent = "En attente de modifications";
    }

})();