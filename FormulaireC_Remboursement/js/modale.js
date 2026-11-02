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
// MODALE — ACHATS SANS PIÈCES JUSTIFICATIVES
// ============================================================

function afficherAvertissementAchatsSansPieces(achatsSansPieces) {

    return new Promise(function(resolve) {

        const fenetre =
            document.getElementById("fenetreAvertissement");

        const messageAvertissement =
            document.getElementById("messageAvertissement");

        const boutonRetour =
            document.getElementById("boutonRetourAvertissement");

        const boutonPoursuivre =
            document.getElementById("boutonPoursuivreAvertissement");

        if (
            !fenetre ||
            !messageAvertissement ||
            !boutonRetour ||
            !boutonPoursuivre
        ) {
            resolve(false);
            return;
        }

        // ----------------------------------------------------
        // MESSAGE D'INTRODUCTION
        // ----------------------------------------------------

        messageAvertissement.innerHTML = "";

        const introduction = document.createElement("p");

        introduction.textContent =
            "Aucune pièce justificative n'est associée aux achats suivants :";

        messageAvertissement.appendChild(introduction);


        // ----------------------------------------------------
        // LISTE DES ACHATS SANS PIÈCES
        // ----------------------------------------------------

        const liste = document.createElement("div");

        liste.className = "liste-achats-sans-pieces";

        const titre = document.createElement("strong");

        titre.textContent = "ACHATS À COMPLÉTER";

        liste.appendChild(titre);

        const numeros = document.createElement("div");

        numeros.className = "numeros-achats-sans-pieces";

        achatsSansPieces.forEach(function(numero) {

            const achat = document.createElement("span");

            achat.className = "badge-achat-sans-piece";
            achat.textContent = "Achat nº " + numero;

            numeros.appendChild(achat);

        });

        liste.appendChild(numeros);

        messageAvertissement.appendChild(liste);


        // ----------------------------------------------------
        // AVERTISSEMENT CONCERNANT LES DOCUMENTS ORIGINAUX
        // ----------------------------------------------------

 	const avertissement = document.createElement("p");

	avertissement.textContent =
	    "À défaut d'inclure les pièces justificatives, le rapport ne sera pas traité tant que les pièces justificatives originales requises n'auront pas été reçues.";

	avertissement.className =
	    "avertissement-pieces-originales";

	messageAvertissement.appendChild(avertissement);


        // ----------------------------------------------------
        // CASE À COCHER « JE COMPRENDS »
        // ----------------------------------------------------

	const conteneurConfirmation =
	    document.createElement("div");

	conteneurConfirmation.className =
	    "confirmation-pieces-originales";

	const caseConfirmation =
	    document.createElement("input");

	caseConfirmation.type = "checkbox";
	caseConfirmation.id = "confirmationPiecesOriginales";

	const etiquette =
	    document.createElement("label");

	etiquette.htmlFor = "confirmationPiecesOriginales";
	etiquette.textContent = "Je comprends";

	conteneurConfirmation.appendChild(caseConfirmation);
	conteneurConfirmation.appendChild(etiquette);

	messageAvertissement.appendChild(conteneurConfirmation);


        // ----------------------------------------------------
        // ÉTAT INITIAL DES BOUTONS
        // ----------------------------------------------------

	boutonPoursuivre.disabled = true;

	fenetre.classList.add("active");


        // ----------------------------------------------------
        // ACTIVATION DE « POURSUIVRE »
        // ----------------------------------------------------

	caseConfirmation.addEventListener("change", function() {

	    boutonPoursuivre.disabled =
		!caseConfirmation.checked;

	    });


        // ----------------------------------------------------
        // BOUTON « CORRIGER »
        // Toujours disponible
        // ----------------------------------------------------

	boutonRetour.disabled = false;

	boutonRetour.onclick = function() {

	    fenetre.classList.remove("active");

	    resolve(false);

	};


        // ----------------------------------------------------
        // BOUTON « POURSUIVRE »
        // Disponible seulement après confirmation
        // ----------------------------------------------------

	boutonPoursuivre.onclick = function() {

	    if (!caseConfirmation.checked) {
		return;
	    }

	    fenetre.classList.remove("active");

	    resolve(true);

	};

    });

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

	    // RÉINITIALISER

	    if (
		typeof window.reinitialiserFormulaire === "function"
	    ) {
		window.reinitialiserFormulaire();
	    }

        }
    );

}


// ============================================================
// RÉINITIALISATION DU FORMULAIRE
// ============================================================

function reinitialiserFormulaire() {

    // --------------------------------------------------------
    // CHAMPS DU FORMULAIRE
    // --------------------------------------------------------

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

            champ.classList.remove(
                "champ-invalide"
            );

        }
    );


    // --------------------------------------------------------
    // ACHATS
    // --------------------------------------------------------

    const listeAchats =
        document.getElementById(
            "listeAchats"
        );

    if (listeAchats) {

        const lignesAchats =
            listeAchats.querySelectorAll(
                ".ligne-achat"
            );

        lignesAchats.forEach(
            function(ligne, index) {

                if (index > 0) {
                    ligne.remove();
                }

            }
        );

    }

    numeroAchat = 1;


    // --------------------------------------------------------
    // TOTAL DES ACHATS
    // --------------------------------------------------------

    const totalAchats =
        document.getElementById(
            "totalAchats"
        );

    if (totalAchats) {

        totalAchats.textContent =
            "0,00 $";

    }


    // --------------------------------------------------------
    // PIÈCES JUSTIFICATIVES
    // --------------------------------------------------------

    const pieces =
        document.getElementById(
            "piecesJustificatives"
        );

    if (pieces) {

        pieces.value = "";

        pieces._fichiersSelectionnes = [];

    }

    const listePieces =
        document.getElementById(
            "listePiecesJustificatives"
        );

    if (listePieces) {

        listePieces.innerHTML = "";

        const message =
            document.createElement("p");

        message.className =
            "message-aucune-piece";

        message.textContent =
            "Aucune pièce justificative ajoutée. Vous devez joindre au moins une pièce justificative à chaque achat pour envoyer le formulaire.";

        listePieces.appendChild(
            message
        );

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

        resumeFichiers.textContent = "";

    }


    // --------------------------------------------------------
    // COMPTEURS DE PIÈCES JUSTIFICATIVES
    // --------------------------------------------------------

    document.querySelectorAll(
        ".nombre-pieces"
    ).forEach(
        function(compteur) {

            compteur.textContent = "0";

	    compteur.classList.remove(
		"pieces-presentes"
	    );

        }
    );


    // --------------------------------------------------------
    // RETOUR À L'ÉTAPE 1
    // --------------------------------------------------------

    afficherEtape(1);


    // --------------------------------------------------------
    // VALIDATION ET AFFICHAGE
    // --------------------------------------------------------

    verifierChampsObligatoires();

    calculerTotalAchats();

    mettreAJourBoutonsAction();

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