// ============================================================
// MODE DÉVELOPPEMENT
// ============================================================

const modeDeveloppement = false;


// ============================================================
// VALIDATION DES ADRESSES COURRIEL
// ============================================================

const formatCourriel =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================
// VALIDATION DES CHAMPS OBLIGATOIRES
// ============================================================

function verifierChampsObligatoires() {

    const champsObligatoires =
        document.querySelectorAll(
            "input[required], textarea[required], select[required]"
        );


    let formulaireValide = true;


    champsObligatoires.forEach(
        function(champ) {

            if (champ.disabled) {
                return;
            }


            if (!champ.value.trim()) {

                formulaireValide = false;

                return;

            }


            if (
                champ.type === "email" &&
                !formatCourriel.test(
                    champ.value.trim()
                )
            ) {

                formulaireValide = false;

            }

        }
    );


    return formulaireValide;

}


// ============================================================
// VALIDATION DE L'ÉTAPE 1
// ============================================================

function validerEtape1() {

    if (modeDeveloppement) {
	return true;
    }

    const champs = [
        {
            id: "nom",
            message: "Veuillez inscrire votre nom complet."
        },
        {
            id: "courriel",
            message: "Veuillez inscrire votre adresse courriel."
        },
        {
            id: "adresse",
            message: "Veuillez inscrire votre adresse."
        },
        {
            id: "dateDepart",
            message: "Veuillez inscrire la date de départ."
        },
        {
            id: "heureDepart",
            message: "Veuillez inscrire l'heure de départ."
        },
        {
            id: "dateRetour",
            message: "Veuillez inscrire la date de retour."
        },
        {
            id: "heureRetour",
            message: "Veuillez inscrire l'heure de retour."
        },
        {
            id: "motifActivite",
            message: "Veuillez inscrire la nature de l'activité."
        }
    ];


    for (const champInfo of champs) {

        const champ =
            document.getElementById(
                champInfo.id
            );


        if (
            !champ ||
            !champ.value ||
            champ.value.trim() === ""
        ) {

            afficherErreur(
                champInfo.message
            );

            return false;

        }

	if (
	    champInfo.id === "courriel" &&
	    !formatCourriel.test(
		champ.value.trim()
	    )
	) {

		afficherErreur(
		    "Veuillez inscrire une adresse courriel valide."
		);

		return false;

	    }

	}


    const dateDepart =
	document.getElementById(
	    "dateDepart"
	).value;

    const dateRetour =
	document.getElementById(
	    "dateRetour"
	).value;

    // --------------------------------------------------------
    // RÈGLE D'ORIENTATION VERS LE FORMULAIRE B
    // --------------------------------------------------------


    if (dateDepart === dateRetour) {

	afficherOrientationFormulaire();

    	return false;

    }


    return true;

}


// ============================================================
// SURVEILLANCE DES CHAMPS OBLIGATOIRES
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const champsObligatoires =
            document.querySelectorAll(
                "input[required], textarea[required], select[required]"
            );


        champsObligatoires.forEach(
            function(champ) {

                champ.addEventListener(
                    "input",
                    verifierChampsObligatoires
                );

                champ.addEventListener(
                    "change",
                    verifierChampsObligatoires
                );

            }
        );


        verifierChampsObligatoires();

    }
);