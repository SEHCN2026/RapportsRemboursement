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

	    // Réinitialiser le formulaire

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

    const dateDepart =
        document.getElementById(
            "dateDepart"
        );

    const dateRetour =
        document.getElementById(
            "dateRetour"
        );


    if (
        dateDepart &&
        dateDepart._flatpickr
    ) {

        dateDepart._flatpickr.clear();

    }


    if (
        dateRetour &&
        dateRetour._flatpickr
    ) {

        dateRetour._flatpickr.clear();

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


    // --------------------------------------------------------
    // AFFICHAGE DE LA DATE
    // --------------------------------------------------------

    const dateDepartAffichee =
        document.getElementById(
            "dateDepartAffichee"
        );

    if (dateDepartAffichee) {
        dateDepartAffichee.textContent = 
	    "";
    }


    // --------------------------------------------------------
    // JOURNÉES
    // --------------------------------------------------------

    numeroJournee = 1;

    creerJournees();


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