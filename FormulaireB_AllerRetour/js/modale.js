// ============================================================
// GESTION DES MODALES
// ============================================================


// ============================================================
// MODALE D'ERREUR
// ============================================================

function afficherErreur(message) {

    const fenetre =
	document.getElementById(
	    "fenetreErreur"
	);

    const messageErreur =
	document.getElementById(
	    "messageErreur"
	);

    if (
	!fenetre || 
	!messageErreur
    ) {
	return;
    }

    messageErreur.textContent =
	message;

    fenetre.classList.add(
	"active"
    );

}

function fermerErreur() {

    const fenetre =
	document.getElementById(
	    "fenetreErreur"
	);

    if (!fenetre) {
	return;
    }

    fenetre.classList.remove(
	"active"
    );

}

const boutonFermerErreur =
    document.getElementById(
	"boutonFermerErreur"
    );

if (boutonFermerErreur) {
    boutonFermerErreur.addEventListener(
	"click",
	fermerErreur
    );

}

function ouvrirModaleErreur(message) {
    afficherErreur(
	message
    );
}

// ============================================================
// MODALE D'AVERTISSEMENT
// ============================================================

function afficherAvertissement(message) {

    return new Promise(
	function(resolve) {

	    const fenetre =
		document.getElementById(
		    "fenetreAvertissement"
		);

	    const messageAvertissement =
		document.getElementById(
		    "messageAvertissement"
		);

	    const boutonRetour =
		document.getElementById(
		    "boutonRetourAvertissement"
		);

	    const boutonPoursuivre =
		document.getElementById(
		    "boutonPoursuivreAvertissement"
		);

	    if (
		!fenetre ||
		!messageAvertissement ||
		!boutonRetour ||
		!boutonPoursuivre
	    ) {

		resolve(false);
		return;
	    }

	    messageAvertissement.textContent =
		message;

	    fenetre.classList.add(
		"active"
	    );

	    boutonRetour.onclick =
		function() {

		    fenetre.classList.remove(
			"active"
		    );

		    resolve(false);

		};

	    boutonPoursuivre.onclick =
		function() {

		    fenetre.classList.remove(
			"active"
		    );

		    resolve(true);

		};

        }

    );

}

// ============================================================
// MODALE DE SUCCÈS
// ============================================================

function afficherSucces() {

    const fenetreSucces =
        document.getElementById(
	    "fenetreSucces"
	);

    if (!fenetreSucces) {
        return;
    }

    fenetreSucces.classList.add(
	"active"
    );
}

const boutonFermerSucces =
    document.getElementById(
	"boutonFermerSucces"
    );

if (boutonFermerSucces) {

    boutonFermerSucces.addEventListener(
        "click",
        function() {

            const fenetreSucces =
                document.getElementById(
		    "fenetreSucces"
		);

            if (fenetreSucces) {
                fenetreSucces.classList.remove(
		    "active"
		);
            }

	    // RÉINITIALISER LE FORMULAIRE

	    if (
		typeof window.reinitialiserFormulaire === "function"
	    ) {
		window.reinitialiserFormulaire();
	    }

        }
    );
}

// ============================================================
// MODALE D'ORIENTATION VERS UN AUTRE FORMULAIRE
// ============================================================


function afficherOrientationFormulaire() {

    const fenetre =
	document.getElementById(
	    "fenetreOrientationFormulaire"
	);

    if (!fenetre) {
	return;
    }

    fenetre.classList.add(
	"active"
    );

}

const fenetreOrientationFormulaire =
    document.getElementById(
	"fenetreOrientationFormulaire"
    );

const boutonResterFormulaire =
    document.getElementById(
	"boutonResterFormulaire"
    );

const boutonRetourAccueil =
    document.getElementById(
	"boutonRetourAccueil"
    );

const boutonCorriger =
    document.getElementById(
	"boutonCorriger"
    );

if (
    boutonCorriger &&
    fenetreOrientationFormulaire
) {
    
    boutonCorriger.addEventListener(
	"click",
	function() {

	    fenetreOrientationFormulaire.classList.remove(
		"active"
	    );
	}
    );
}


if (
    boutonResterFormulaire &&
    fenetreOrientationFormulaire
) {

    boutonResterFormulaire.addEventListener(
	"click",
	function() {
	
	    fenetreOrientationFormulaire.classList.remove(
		"active"
	    );

	    afficherEtape(
		etapeActuelle + 1
	    );
	}
    );
}

if (
    boutonRetourAccueil &&
    fenetreOrientationFormulaire
) {

    boutonRetourAccueil.addEventListener(
	"click",
	function() {
	
	    window.location.href =
		"../index.html";

	}

    );
}

// ============================================================
// RÉINITIALISATION DU FORMULAIRE
// ============================================================

function reinitialiserFormulaire() {

    const champs =
        document.querySelectorAll(
            "input, textarea, select"
        );


    // --------------------------------------------------------
    // ARRÊTS INTERMÉDIAIRES
    // --------------------------------------------------------

    const conteneurArretsAller =
	document.getElementById(
	    "conteneurArretsAller"
	);

    const conteneurArretsRetour =
	document.getElementById(
	    "conteneurArretsRetour"
	);

    if (conteneurArretsAller) {
	conteneurArretsAller.innerHTML = "";
    }

    if (conteneurArretsRetour) {
	conteneurArretsRetour.innerHTML = "";
    }

    champs.forEach(
        function(champ) {

            if (
                champ.type === "checkbox" ||
                champ.type === "radio"
            ) {

                champ.checked = false;

            } else if (
                champ.type !== "file"
            ) {

                champ.value = "";

            }

        }
    );


    // --------------------------------------------------------
    // CALENDRIERS
    // --------------------------------------------------------

    const dateActivite =
        document.getElementById(
            "dateActivite"
        );


    if (
        dateActivite &&
        dateActivite._flatpickr
    ) {

        dateActivite._flatpickr.clear();

    }


    // --------------------------------------------------------
    // PIÈCES JUSTIFICATIVES
    // --------------------------------------------------------

    const pieces =
        document.getElementById(
            "piecesJustificatives"
        );

    if (pieces) {
        pieces.value = 
	    "";

	pieces._fichiersSelectionnes =
	    [];
    }


    const listePieces =
        document.getElementById(
            "listePiecesJustificatives"
        );

    if (listePieces) {
        listePieces.innerHTML = "";
    }


    const entetePieces =
        document.getElementById(
            "entetePiecesJustificatives"
        );

    if (entetePieces) {
        entetePieces.style.display = 
	    "none";
    }

    const resumeFichiers =
	document.getElementById(
	    "resumeFichiers"
	);

    if (resumeFichiers) {
	resumeFichiers.textContent =
	    "";

    }


    // --------------------------------------------------------
    // AFFICHAGE DE LA DATE
    // --------------------------------------------------------

    const dateActiviteAffichee =
        document.getElementById(
            "dateActiviteAffichee"
        );

    if (dateActiviteAffichee) {
        dateActiviteAffichee.textContent = 
	    "";
    }


    // --------------------------------------------------------
    // RETOUR À L'ÉTAPE 1
    // --------------------------------------------------------

    afficherEtape(
	1
    );


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    verifierChampsObligatoires();

}

// ============================================================
// CONFIRMATION DE RÉINITIALISATION
// ============================================================

const boutonReinitialiser =
    document.getElementById(
	"boutonReinitialiser"
    );

const fenetreReinitialisation =
    document.getElementById(
	"fenetreReinitialisation"
    );

const boutonAnnulerReinitialisation =
    document.getElementById(
	"boutonAnnulerReinitialisation"
    );

const boutonConfirmerReinitialisation =
    document.getElementById(
	"boutonConfirmerReinitialisation"
    );


if (
    boutonReinitialiser &&
    fenetreReinitialisation
) {
    
    boutonReinitialiser.addEventListener(
	"click",
	function() {

	    fenetreReinitialisation.classList.add(
		"active"
	    );
	}
    );
}

if (
    boutonAnnulerReinitialisation &&
    fenetreReinitialisation
) {
    
    boutonAnnulerReinitialisation.addEventListener(
	"click",
	function() {

	    fenetreReinitialisation.classList.remove(
		"active"
	    );

	}
    );
}

if (
    boutonConfirmerReinitialisation &&
    fenetreReinitialisation
) {

    boutonConfirmerReinitialisation.addEventListener(
	"click",
	function() {

	    fenetreReinitialisation.classList.remove(
	    	"active"
	    );

	    reinitialiserFormulaire();

	}
    );
}