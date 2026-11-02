
 // ============================================================
 // NAVIGATION ENTRE LES ÉTAPES
 // ============================================================


// ============================================================
// ÉTAT DE LA NAVIGATION
// ============================================================

let etapeActuelle = 1;

const nombreEtapes = 4;


// ============================================================
// AFFICHER UNE ÉTAPE
// ============================================================

function afficherEtape(numeroEtape) {

    const etapes =
        document.querySelectorAll(
            ".etape, .etape3, .etape4"
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
            "totalAchats",
            "verificationTotalAchats"
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

    const justification =
        document.getElementById(
            "justificationAdditionnelle"
        )?.value || "";

    const champPieces =
        document.getElementById(
            "piecesJustificatives"
        );


    const nombrePieces =
        champPieces?._fichiersSelectionnes
            ? champPieces._fichiersSelectionnes.length
            : champPieces?.files?.length || 0;


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


    // --------------------------------------------------------
    // JUSTIFICATIONS ADDITIONNELLES
    // --------------------------------------------------------

    document.getElementById(
        "verificationJustificationAdditionnelle"
    ).textContent =
        justification || "—";


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
    // PRÉPARER L'ÉTAPE 3
    // --------------------------------------------------------

    if (etapeActuelle === 2) {

	if (!modeDeveloppement) {

        // ----------------------------------------------------
        // VALIDATION DES CHAMPS OBLIGATOIRES DES ACHATS
        // ----------------------------------------------------

        const lignesAchatsAValider =
            document.querySelectorAll(
                "#listeAchats .ligne-achat"
            );

        for (const achat of lignesAchatsAValider) {

            const date =
                achat.querySelector(".date-achat");

            const motif =
                achat.querySelector(".motif-achat");

            const description =
                achat.querySelector(".description-achat");

            const precision =
                achat.querySelector(".precision-motif-achat");

            const cout =
                achat.querySelector(".cout-achat");


            // DATE DE L'ACHAT

            if (!date || !date.value.trim()) {

		afficherErreur(
		    "Veuillez sélectionner la date de l'achat nº " +
		    achat.dataset.numero + "."
		);

                return;

            }


            // MOTIF, DESCRIPTION ET COÛT

            const champsObligatoires = [
                motif,
                description,
                cout
            ];

            for (const champ of champsObligatoires) {

                if (
                    !champ ||
                    !champ.value.trim()
                ) {

                    champ?.focus();

                    if (champ) {

			if (champ.classList.contains("motif-achat")) {
			    champ.setCustomValidity(
				"Veuillez sélectionner le motif de l'achat."
			    );
			}

			else if (champ.classList.contains("description-achat")) {
			    champ.setCustomValidity(
				"Veuillez décrire l'achat."
			    );
			}

			else if (champ.classList.contains("cout-achat")) {
			    champ.setCustomValidity(
				"Veuillez indiquer le coût de l'achat."
			    );
			}

                        champ.reportValidity();

			champ.addEventListener(
			    "input",
			    function() {
				champ.setCustomValidity("");
			    },
			    {once: true}
			);

			champ.addEventListener(
			    "change",
			    function() {
				champ.setCustomValidity("");
			},
			{ once: true }
                    );

		}

                return;

                }

            }


            // PRÉCISION DU MOTIF « AUTRE »

            if (
                motif.value === "Autre" &&
                precision &&
                !precision.value.trim()
            ) {

                precision.setCustomValidity(
		    "Veuillez préciser le motif de l'achat."
		);

		precision.focus();
                precision.reportValidity();

		precision.addEventListener(
		    "input",
		    function() {
			precision.setCustomValidity("");
		    },
		    { once: true }
		);

                return;

            }

        }

	}

        const pieces =
            document.getElementById(
                "piecesJustificatives"
            );

	const fichiers =
	    pieces?._fichiersSelectionnes ||
	    pieces?.files ||
 	    [];

	const achats =
	    document.querySelectorAll(
		"#listeAchats .ligne-achat"
	    );

	const achatsSansPieces = [];

	achats.forEach(function(achat) {

	    const numero =
		Number(achat.dataset.numero);

	    const nombrePieces =
		document.querySelectorAll(
		    "#listePiecesJustificatives .piece-justificative"
		);

	    let piecesAssociees = 0;

	    nombrePieces.forEach(function(piece) {

		if (
		    Number(piece.dataset.numeroAchat) === numero
		) {
		    piecesAssociees++;
		}

	    });

	    if (piecesAssociees === 0) {

		achatsSansPieces.push(numero);

	    }

	});


    	// ----------------------------------------------------
    	// AVERTISSEMENT SI DES ACHATS N'ONT PAS DE PIÈCE
    	// ----------------------------------------------------

	if (achatsSansPieces.length > 0) {

	    const poursuivre =
		await afficherAvertissementAchatsSansPieces(
		    achatsSansPieces
		);

	    if (!poursuivre) {
		return;
	    }

	}

    }


    // --------------------------------------------------------
    // PASSER À L'ÉTAPE SUIVANTE
    // --------------------------------------------------------

    if (etapeActuelle < nombreEtapes) {

	const prochaineEtape =
	    etapeActuelle + 1;

	if (prochaineEtape === 4) {
	    mettreAJourVerificationRapport();
	}

        afficherEtape(prochaineEtape);

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