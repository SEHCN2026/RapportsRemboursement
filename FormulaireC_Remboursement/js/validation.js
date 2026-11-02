/* ================================
   MODE DÉVELOPPEMENT
================================ */

const modeDeveloppement = false;

const formatCourriel =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


/* ================================
   VALIDATION DES CHAMPS OBLIGATOIRES
================================ */

function verifierChampsObligatoires() {

    let formulaireComplet = true;

    const champsObligatoires = [
        "nom",
        "courriel",
        "adresse"
    ];

    /* ================================
       VALIDATION DES CHAMPS
    ================================ */

    champsObligatoires.forEach(
	function(id) {

            const champ =
                document.getElementById(id);

            if (!champ) {
	        formulaireComplet = false;
		return;
	    }

	    if (!champ.value.trim()) {

                formulaireComplet = false;

	        champ.classList.add(
		    "champ-invalide"
	        );

	    } else {

	        champ.classList.remove(
		    "champ-invalide"
		
		);

	    }
    
        }
    );

    /* ================================
       VALIDATION DU COURRIEL
    ================================ */

    const champCourriel =
        document.getElementById("courriel");

    if (!champCourriel) {

        formulaireComplet = false;

    } else {

        const courriel =
            champCourriel.value.trim();

        const formatCourriel =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            courriel === "" ||
            !formatCourriel.test(courriel)
        ) {

            formulaireComplet = false;

        }

    }

}


/* ================================
   SURVEILLANCE DES CHAMPS
================================ */

const champsObligatoires = [
    "nom",
    "courriel",
    "adresse"
];


champsObligatoires.forEach(
    function(id) {

        const champ =
            document.getElementById(id);

        if (!champ) {
            return;
        }


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

/* ================================
   ÉTAT INITIAL
================================ */

verifierChampsObligatoires();


/* ================================
   VALIDATION DE L'ÉTAPE 1
================================ */

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


    return true;

}