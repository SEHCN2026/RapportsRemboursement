// ============================================================
// NAVIGATION ENTRE LES ÉTAPES
// ============================================================

// ============================================================
// ÉTAT DE LA NAVIGATION
// ============================================================

let etapeActuelle = 1;

const nombreEtapes = 5;


// ============================================================
// AFFICHER UNE ÉTAPE
// ============================================================

function afficherEtape(numeroEtape) {

    const etapes =
	document.querySelectorAll(
	    ".etape"
	);

    const etapesProgression =
	document.querySelectorAll(
	    ".progression-etape"
	);

    const lignesProgression =
	document.querySelectorAll(
	    ".ligne-progression"
	);

    // --------------------------------------------------------
    // AFFICHER L'ÉTAPE ACTIVE
    // --------------------------------------------------------

    etapes.forEach(
	function(etape) {

	    const numero =
		Number(
		    etape.dataset.etape
		);

	    etape.style.display =
		numero === numeroEtape
		    ? ""
		    : "none";

	}
    );

    // --------------------------------------------------------
    // METTRE À JOUR LA PROGRESSION
    // --------------------------------------------------------

    etapesProgression.forEach(
	function(etape) {
	
	    const numero =
		Number(
		    etape.dataset.etape
		);

	    etape.classList.toggle(
		"active",
		numero === numeroEtape
	    );

	    etape.classList.toggle(
		"complete",
		numero < numeroEtape
	    );

	}
    );


    lignesProgression.forEach(
	function(ligne) {

	    const numero =
		Number(
		    ligne.dataset.ligne
		);

	    ligne.classList.toggle(
		"complete",
		numero < numeroEtape
	    );

	}
    );

    // --------------------------------------------------------
    // AFFICHER / MASQUER LES BOUTONS DE NAVIGATION
    // --------------------------------------------------------

    const boutonRetour =
	document.getElementById(
	    "boutonRetour"
	);

    const boutonSuivant =
	document.getElementById(
	    "boutonSuivant"
	);


    if (boutonRetour) {

	boutonRetour.style.display =
	    numeroEtape === 1
		? "none"
		: "";

    }


    if (boutonSuivant) {

	boutonSuivant.style.display =
	    numeroEtape === nombreEtapes
		? "none"
		: "";

    }


    etapeActuelle =
	numeroEtape;

    window.scrollTo({
	top: 0,
	behavior: "smooth"
    });

}


// ============================================================
// DONNÉES DE VÉRIFICATION
// ============================================================


// ------------------------------------------------------------
// METTRE À JOUR LES TOTAUX DE VÉRIFICATION
// ------------------------------------------------------------

function mettreAJourTotauxVerification() {

    const correspondances = [
        [
            "totalRapportKilometrage",
            "totalRapportKilometrageVerification"
        ],
        [
            "totalRapportAutresTransports",
            "totalRapportAutresTransportsVerification"
        ],
        [
            "totalRapportRepas",
            "totalRapportRepasVerification"
        ],
        [
            "totalRapportHebergement",
            "totalRapportHebergementVerification"
        ],
        [
            "totalRapportAutresDepenses",
            "totalRapportAutresDepensesVerification"
        ],
        [
            "totalRapportGeneral",
            "totalRapportGeneralVerification"
        ]
    ];


    correspondances.forEach(
	function(correspondance) {

	    const source =
		document.getElementById(
		    correspondance[0]
		);

	    const destination =
		document.getElementById(
		    correspondance[1]
		);


	    if (
		source &&
		destination
	    ) {

		destination.textContent =
		    source.textContent;

	    }

	}
    );

}


// ------------------------------------------------------------
// FORMATER UNE DATE POUR LA VÉRIFICATION
// ------------------------------------------------------------

function formaterDateVerification(date) {

    if (!date) {
	return "";
    }


    const parties =
	date.split("-");


    if (parties.length !== 3) {
	return date;
    }


    const annee =
	parties[0];

    const mois =
	Number(
	    parties[1]
	);

    const jour =
	Number(
	    parties[2]
	);


    const nomsMois = [
	"janvier",
	"février",
	"mars",
	"avril",
	"mai",
	"juin",
	"juillet",
	"août",
	"septembre",
	"octobre",
	"novembre",
	"décembre"
    ];


    return (
	Number(jour) +
	" " +
	nomsMois[mois - 1] +
	" " +
	annee
    );

}


// ------------------------------------------------------------
// METTRE À JOUR LA VÉRIFICATION DU RAPPORT
// ------------------------------------------------------------

function mettreAJourVerificationRapport() {

    const nom =
	document.getElementById(
	    "nom"
	)?.value || "";

    const courriel =
	document.getElementById(
	    "courriel"
	)?.value || "";

    const adresse =
	document.getElementById(
	    "adresse"
	)?.value || "";

    const motif =
	document.getElementById(
	    "motifActivite"
	)?.value || "";

    const dateDepart =
	document.getElementById(
	    "dateDepart"
	)?.value || "";

    const heureDepart =
	document.getElementById(
	    "heureDepart"
	)?.value || "";

    const dateRetour =
	document.getElementById(
	    "dateRetour"
	)?.value || "";

    const heureRetour =
	document.getElementById(
	    "heureRetour"
	)?.value || "";


    const nombreJournees =
	document.querySelectorAll(
	    "#conteneurJournees section"
	).length;


    const champPieces =
	document.getElementById(
	    "piecesJustificatives"
	);


    const nombrePieces =
	champPieces?.files?.length || 0;

    // --------------------------------------------------------
    // IDENTIFICATION
    // --------------------------------------------------------


    document.getElementById(
	"verificationNom"
    ).textContent =
	nom || "—";


    document.getElementById(
	"verificationCourriel"
    ).textContent =
	courriel || "—";


    document.getElementById(
	"verificationAdresse"
    ).textContent =
	adresse || "—";


    document.getElementById(
	"verificationMotifActivite"
    ).textContent =
	motif || "—";

    // --------------------------------------------------------
    // DATES
    // --------------------------------------------------------


    document.getElementById(
	"verificationDepart"
    ).textContent =
	dateDepart && heureDepart
	    ? formaterDateVerification(
		dateDepart
	    ) +
	      " à " +
	      heureDepart
	    : "—";


    document.getElementById(
	"verificationRetour"
    ).textContent =
	dateRetour && heureRetour
	    ? formaterDateVerification(
		dateRetour
	    ) +
	      " à " +
	      heureRetour
	    : "—";

    // --------------------------------------------------------
    // NOMBRE DE JOURNÉES ET DE PIÈCES
    // --------------------------------------------------------


    document.getElementById(
	"verificationNombreJournees"
    ).textContent =
	nombreJournees;


    document.getElementById(
	"verificationNombrePieces"
    ).textContent =
	nombrePieces;

    // --------------------------------------------------------
    // TOTAL GÉNÉRAL
    // --------------------------------------------------------


    const totalGeneral =
	document.getElementById(
	    "totalRapportGeneral"
	)?.textContent || 
	"0,00 $";


    document.getElementById(
	"verificationTotalGeneral"
    ).textContent =
	totalGeneral;

}


// ============================================================
// NAVIGATION VERS L'ÉTAPE SUIVANTE
// ============================================================

async function allerEtapeSuivante() {

    // --------------------------------------------------------
    // VALIDATION DE L'ÉTAPE 1
    // --------------------------------------------------------

    if (
	etapeActuelle === 1
    ) {

	if (
	    !validerEtape1()
	) {

	    return;

	}

    }


    // --------------------------------------------------------
    // VALIDATION DES CHAMPS OBLIGATOIRES À L'ÉTAPE 2
    // --------------------------------------------------------

    if (
	etapeActuelle === 2
    ) {

	if (
	    !verifierChampsObligatoires()
	) {

	    afficherErreur(
		"Vous avez indiqué une dépense dans 'Autres' sans y indiquer de justification. Veuillez justifier la dépense."
	    );

	    return;

	}

    }

    // --------------------------------------------------------
    // VÉRIFICATION DU TOTAL À L'ÉTAPE 2
    // --------------------------------------------------------


    if (
	etapeActuelle === 2
    ) {
	
	const totalRapport =
	    montantEnNombre(
		document.getElementById(
		    "totalRapportGeneral"
		)?.textContent || 
		""
	    );


	if (
	    totalRapport === 0 &&
	    !modeDeveloppement
	) {

	    const poursuivre =
		await afficherAvertissement(
		    "Êtes-vous certain de vouloir poursuivre avec un rapport sans aucune dépense?"
		);


	    if (!poursuivre) {

		return;

	    }

	}

    }

    // --------------------------------------------------------
    // PASSER À L'ÉTAPE SUIVANTE
    // --------------------------------------------------------


    if (
	etapeActuelle < nombreEtapes
    ) {

        // ----------------------------------------------------
        // PRÉPARER L'ÉTAPE 5
        // ----------------------------------------------------

	if (etapeActuelle === 4) {

	    const champPieces =
		document.getElementById(
		    "piecesJustificatives"
  		);

	    const nombrePieces =
		champPieces?.files?.length || 0;

	    if (nombrePieces === 0) {

		const poursuivre =
		    await afficherAvertissement(
			"Aucune pièce justificative n'a été ajoutée au rapport. Souhaitez-vous poursuivre sans joindre de fichier?"
		    );

		if (!poursuivre) {
		    return;
		}

	    }

	}

	if (etapeActuelle === 4) {

	    mettreAJourTotauxVerification();

	    mettreAJourVerificationRapport();

	}


	afficherEtape(
	    etapeActuelle + 1
	);

    }

}


// ============================================================
// NAVIGATION VERS L'ÉTAPE PRÉCÉDENTE
// ============================================================

function allerEtapePrecedente() {

    if (
	etapeActuelle >	1
    ) {

	afficherEtape(
	    etapeActuelle - 1
	);

    }

}


// ============================================================
// BOUTONS DE NAVIGATION
// ============================================================


// ------------------------------------------------------------
// BOUTON « SUIVANT »
// ------------------------------------------------------------

document.getElementById(
    "boutonSuivant"
)
.addEventListener(
    "click",
    allerEtapeSuivante
);


// ------------------------------------------------------------
// BOUTON « RETOUR »
// ------------------------------------------------------------

document.getElementById(
    "boutonRetour"
)
.addEventListener(
    "click",
    allerEtapePrecedente
);


// ------------------------------------------------------------
// BOUTON « ACCUEIL »
// ------------------------------------------------------------

const boutonAccueil =
    document.getElementById(
	"boutonAccueil"
    );

if (boutonAccueil) {
    
    boutonAccueil.addEventListener(
	"click",
	function() {
	
	    window.location.href =
		"../index.html";

	}
    );

}


// ============================================================
// INITIALISATION
// ============================================================

afficherEtape(1);