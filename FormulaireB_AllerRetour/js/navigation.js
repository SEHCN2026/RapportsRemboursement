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

    const correspondance = [

        [
            "totalRapportKilometrage",
            "verificationKilometrage"
        ],

        [
            "totalRapportAutresTransports",
            "verificationAutresTransports"
        ],

        [
            "totalRapportRepas",
            "verificationRepas"
        ],

        [
            "totalRapportAutresDepenses",
            "verificationAutresDepenses"
        ],

        [
            "totalRapportGeneral",
            "verificationTotalGeneral"
        ]

    ];


    correspondance.forEach(
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


    const nomMois = [

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
	nomMois[mois - 1] +
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

    const dateActivite =
	document.getElementById(
	    "dateActivite"
	)?.value || "";

    const heureDepart =
	document.getElementById(
	    "heureDepart"
	)?.value || "";

    const heureRetour =
	document.getElementById(
	    "heureRetour"
	)?.value || "";

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
    // DATE ET HORAIRE
    // --------------------------------------------------------

    document.getElementById(
	"verificationDateActivite"
    ).textContent =
	dateActivite
	    ? formaterDateVerification(
		dateActivite
	    )
	    : "—";

    document.getElementById(
	"verificationHeureDepart"
    ).textContent =
	heureDepart || "—";

    document.getElementById(
	"verificationHeureRetour"
    ).textContent =
	heureRetour || "—";


    // --------------------------------------------------------
    // NOMBRE DE PIÈCES
    // --------------------------------------------------------


    document.getElementById(
	"verificationNombrePieces"
    ).textContent =
	nombrePieces;


    // --------------------------------------------------------
    // TOTAUX
    // --------------------------------------------------------

    mettreAJourTotauxVerification();

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
    // VALIDATION DE L'ÉTAPE 1
    // --------------------------------------------------------

    if (etapeActuelle === 2) {


        // ----------------------------------------------------
        // VALIDATION DES ARRÊTS INTERMÉDIAIRES
        // ----------------------------------------------------

	const trajetAvecArrets =
	    document.getElementById("trajetAvecArrets");

	if (trajetAvecArrets?.checked) {

	const conteneurAller =
	    document.getElementById("conteneurArretsAller");

	const conteneurRetour =
	    document.getElementById("conteneurArretsRetour");

	    const arrets = [
		...(conteneurAller?.querySelectorAll(".ville-arret") || []),
		...(conteneurRetour?.querySelectorAll(".ville-arret") || [])
	    ];

	    const arretIncomplet = arrets.some(
		function(arret) {
		    return arret.value.trim() === "";
		}
	    );

	    if (arretIncomplet) {

		afficherErreur(
		    "Arrêt intermédiaire incomplet — Veuillez sélectionner une ville pour chaque arrêt intermédiaire ou supprimer les lignes inutilisées avant de poursuivre."
	 	);

		return;
	    }
	}


        // ----------------------------------------------------
        // VALIDATION DE LA JUSTIFICATION DES AUTRES DÉPENSES
        // ----------------------------------------------------

    	const montantAutresDepenses =
	    parseFloat(
	    	document.getElementById(
		    "autresDepenses")?.value
		) || 0;

    	const justification =
	    document.getElementById(
	    	"justification")?.value.trim() || "";

    	if (
	    montantAutresDepenses > 0 && 
	    justification === "") {

	    afficherErreur(
	    	"Vous avez indiqué une dépense dans 'Autres' sans y indiquer de justification. Veuillez justifier la dépense."
	    );

	    return;

    	}


        // ----------------------------------------------------
        // CALCUL DES TOTAUX
        // ----------------------------------------------------

	const totalDeplacements =
	    montantEnNombre(
		document.getElementById(
		    "totalDeplacements"
		)?.textContent || ""
	    );

	const totalAutresTransports =
	    montantEnNombre(
		document.getElementById(
		    "totalAutresTransports"
		)?.textContent || ""
	    );

	const totalRepas =
	    montantEnNombre(
		document.getElementById(
		    "totalRepas"
		)?.textContent || ""
	    );

        /*
         * Si aucun déplacement, aucun autre transport
         * et aucun repas n'est inscrit, la demande
         * semble plutôt relever du formulaire C.
         *
         * Les frais divers ne comptent donc pas ici.
         */

	if(
	    totalDeplacements === 0 &&
	    totalAutresTransports === 0 &&
 	    totalRepas === 0
	) {
	    afficherOrientationFormulaire();
	    return;
	}

    }


    // --------------------------------------------------------
    // PRÉPARER L'ÉTAPE 5
    // --------------------------------------------------------

    if (
	etapeActuelle === 4
    ) {

	const pieces =
	    document.getElementById(
		"piecesJustificatives"
	    );

	const nombrePieces =
	    pieces &&
	    pieces._fichiersSelectionnes
		? pieces._fichiersSelectionnes.length
		: 0;

	if (nombrePieces === 0) {

	    const poursuivre =
		await afficherAvertissement(
		    "Vous n'avez ajouté aucune pièces justificative à votre rapport. Voulez-vous poursuivre sans joindre de document?"
		);

	    if (!poursuivre) {
		return;
	    }
	}

	mettreAJourVerificationRapport();

    }


    // --------------------------------------------------------
    // PASSER À L'ÉTAPE SUIVANTE
    // --------------------------------------------------------

    if (
	etapeActuelle < nombreEtapes
    ) {

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
	etapeActuelle > 1
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