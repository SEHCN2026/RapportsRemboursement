// ============================================================
// FORMULAIRE C — GESTION DES PIÈCES JUSTIFICATIVES
// ============================================================


// ============================================================
// PARAMÈTRES DE TÉLÉVERSEMENT
// ============================================================

const NOMBRE_MAX_FICHIERS = 10;

const TAILLE_MAX_FICHIERS = 10 * 1024 * 1024;

const EXTENSIONS_FICHIERS = [
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "svg",
    "doc",
    "docx",
    "xls",
    "xlsx"
];


// ============================================================
// CHAMP DE FICHIERS
// ============================================================

const champFichiers = document.getElementById(
    "piecesJustificatives"
);

if (champFichiers && !champFichiers._fichiersSelectionnes) {
    champFichiers._fichiersSelectionnes = [];
}


// ============================================================
// ICÔNE SELON LE TYPE DE FICHIER
// ============================================================

function obtenirIconeFichier(nomFichier) {

    const extension = nomFichier.split(".").pop().toLowerCase();

    if (extension === "pdf") {
        return "📑";
    }

    if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) {
        return "🖼️";
    }

    if (["doc", "docx"].includes(extension)) {
        return "📄";
    }

    if (["xls", "xlsx"].includes(extension)) {
        return "📊";
    }

    return "📚";
}


// ============================================================
// OBTENIR LE NUMÉRO D'ACHAT ASSOCIÉ À UN FICHIER
// ============================================================

function obtenirNumeroAchatPiece(element) {

    if (!element) {
        return null;
    }

    const numero = element.numeroAchat;

    return numero === null || numero === undefined
        ? null
        : Number(numero);
}


// ============================================================
// SYNCHRONISER LA COLLECTION ET LE CHAMP DE FICHIERS
// ============================================================

function synchroniserChampFichiers() {

    if (!champFichiers) {
        return;
    }

    const transfert = new DataTransfer();

    champFichiers._fichiersSelectionnes.forEach(
        function(element) {
            transfert.items.add(element.fichier);
        }
    );

    champFichiers.files = transfert.files;
}


// ============================================================
// AJOUTER DES FICHIERS
// ============================================================

function ajouterFichiers(fichiers, numeroAchat = null) {

    if (!champFichiers) {
        return;
    }

    const selection = champFichiers._fichiersSelectionnes;

    Array.from(fichiers).forEach(function(fichier) {

        // ----------------------------------------------------
        // VÉRIFIER LES DOUBLONS
        // ----------------------------------------------------

        const existeDeja = selection.some(function(element) {

            return (
                element.fichier.name === fichier.name &&
                element.fichier.size === fichier.size &&
                element.fichier.lastModified === fichier.lastModified
            );

        });

        if (existeDeja) {

            afficherErreurTeleversement(
                "Le fichier « " + fichier.name +
                " » a déjà été sélectionné."
            );

            return;
        }


        // ----------------------------------------------------
        // VÉRIFIER LA TAILLE
        // ----------------------------------------------------

        if (fichier.size > TAILLE_MAX_FICHIERS) {

            afficherErreurTeleversement(
                "Le fichier « " + fichier.name +
                " » dépasse la taille maximale de 10 Mo."
            );

            return;
        }


        // ----------------------------------------------------
        // VÉRIFIER LE FORMAT
        // ----------------------------------------------------

        const extension = fichier.name.split(".").pop().toLowerCase();

        if (!EXTENSIONS_FICHIERS.includes(extension)) {

            afficherErreurTeleversement(
                "Le type de fichier « " + fichier.name +
                " » n'est pas accepté."
            );

            return;
        }


        // ----------------------------------------------------
        // VÉRIFIER LE NOMBRE MAXIMAL
        // ----------------------------------------------------

        if (selection.length >= NOMBRE_MAX_FICHIERS) {

            afficherErreurTeleversement(
                "Vous pouvez sélectionner un maximum de 10 fichiers."
            );

            return;
        }


        // ----------------------------------------------------
        // AJOUTER LE FICHIER AVEC SON ASSOCIATION
        // ----------------------------------------------------

        selection.push({
            fichier: fichier,
            numeroAchat: numeroAchat === null
                ? null
                : Number(numeroAchat)
        });

    });

    synchroniserChampFichiers();
    afficherListePieces();
    mettreAJourNombrePieces();
}


// ============================================================
// AFFICHER LA LISTE DES FICHIERS
// ============================================================

function afficherListePieces() {

    const conteneur = document.getElementById(
        "listePiecesJustificatives"
    );

    const enTete = document.getElementById(
        "entetePiecesJustificatives"
    );

    const resume = document.getElementById(
        "resumeFichiers"
    );

    if (!conteneur || !enTete) {
        return;
    }

    const selection = champFichiers
        ? champFichiers._fichiersSelectionnes
        : [];

    conteneur.innerHTML = "";

    selection.forEach(function(element, index) {

        const fichier = element.fichier;
        const numeroAchat = obtenirNumeroAchatPiece(element);

        const ligne = document.createElement("div");

        ligne.className = "piece-justificative";

	if (index > 0) {

	    const numeroAchatPrecedent =
		obtenirNumeroAchatPiece(selection[index - 1]);

	    if (numeroAchat !== numeroAchatPrecedent) {
		ligne.classList.add("separateur-nouvel-achat");
	    }
	}

        if (numeroAchat !== null) {
            ligne.dataset.numeroAchat = numeroAchat;
        }


        // ----------------------------------------------------
        // INFORMATIONS DU FICHIER
        // ----------------------------------------------------

        const informations = document.createElement("div");

        informations.className = "informations-fichier";

        const icone = document.createElement("span");

        icone.className = "icone-fichier";
        icone.textContent = obtenirIconeFichier(fichier.name);

        const details = document.createElement("div");

        details.className = "details-fichier";

        const nom = document.createElement("span");

        nom.className = "nom-fichier";
        nom.textContent = fichier.name;

        const taille = document.createElement("span");

        taille.className = "taille-fichier";
        taille.textContent = formaterTailleFichier(fichier.size);

        details.appendChild(nom);
        details.appendChild(taille);

        informations.appendChild(icone);
        informations.appendChild(details);

        ligne.appendChild(informations);


        // ----------------------------------------------------
        // ASSOCIATION À L'ACHAT
        // ----------------------------------------------------

        const association = document.createElement("span");

        association.className = "achat-piece";

        association.textContent = numeroAchat === null
            ? "Non associé"
            : "Achat " + numeroAchat;

        ligne.appendChild(association);


        // ----------------------------------------------------
        // BOUTON DE SUPPRESSION
        // ----------------------------------------------------

        const boutonSupprimer = document.createElement("button");

        boutonSupprimer.type = "button";
        boutonSupprimer.className = "supprimer-piece";
        boutonSupprimer.textContent = "🗑";
        boutonSupprimer.setAttribute(
            "aria-label",
            "Supprimer " + fichier.name
        );

        boutonSupprimer.addEventListener("click", function() {

            // Retirer uniquement le fichier visé.
            selection.splice(index, 1);

            synchroniserChampFichiers();
            afficherListePieces();
            mettreAJourNombrePieces();

        });

        ligne.appendChild(boutonSupprimer);

        conteneur.appendChild(ligne);

    });


    // --------------------------------------------------------
    // EN-TÊTE, MESSAGE ET RÉSUMÉ
    // --------------------------------------------------------

    // Retirer l'ancien message avant de reconstruire la liste.
    const ancienMessage = conteneur.querySelector(
        ".message-aucune-piece"
    );

    if (ancienMessage) {
        ancienMessage.remove();
    }

    if (selection.length > 0) {

        enTete.style.display = "grid";

        const tailleTotale = selection.reduce(
            function(total, element) {
                return total + element.fichier.size;
            },
            0
        );

        if (resume) {
            resume.textContent =
                selection.length +
                (selection.length === 1
                    ? " fichier sélectionné"
                    : " fichiers sélectionnés") +
                " · " +
                formaterTailleFichier(tailleTotale) +
                " au total";
        }

    } else {

        enTete.style.display = "none";

        const messageAucunePiece = document.createElement("div");

        messageAucunePiece.className = "message-aucune-piece";

        messageAucunePiece.textContent =
            "Aucune pièce justificative ajoutée. Vous devez joindre au moins une pièce justificative à chaque achat pour envoyer le formulaire.";

        conteneur.appendChild(messageAucunePiece);

        if (resume) {
            resume.textContent = "";
        }

    }

}


// ============================================================
// SÉLECTION DE FICHIERS DEPUIS LE CHAMP
// ============================================================

if (champFichiers) {

    champFichiers.addEventListener("change", function() {

        const fichiers = Array.from(this.files);

        // Le numéro est fourni par le bouton de l'achat.
        const numeroAchat = this.dataset.numeroAchat
            ? Number(this.dataset.numeroAchat)
            : null;

        // Effacer l'association temporaire pour éviter qu'elle
        // soit réutilisée lors d'une sélection ultérieure.
        delete this.dataset.numeroAchat;

        ajouterFichiers(fichiers, numeroAchat);

    });

}


// ============================================================
// FORMATAGE DE LA TAILLE
// ============================================================

function formaterTailleFichier(taille) {

    if (taille < 1024) {
        return taille + " octets";
    }

    if (taille < 1024 * 1024) {
        return (taille / 1024).toFixed(0) + " Ko";
    }

    return (taille / (1024 * 1024)).toFixed(1) + " Mo";

}


// ============================================================
// MISE À JOUR DU COMPTEUR DE PIÈCES PAR ACHAT
// ============================================================

function mettreAJourNombrePieces() {

    document.querySelectorAll(
        "#listeAchats .nombre-pieces"
    ).forEach(function(compteur) {

        compteur.textContent = "0";
        compteur.classList.remove("pieces-presentes");

    });

    if (!champFichiers) {
        return;
    }

    champFichiers._fichiersSelectionnes.forEach(
        function(element) {

            const numero = obtenirNumeroAchatPiece(element);

            if (numero === null) {
                return;
            }

            const compteur = document.getElementById(
                "nombrePieces" + numero
            );

            if (!compteur) {
                return;
            }

            compteur.textContent =
                (Number(compteur.textContent) || 0) + 1;

            compteur.classList.add("pieces-presentes");

        }
    );

}


// ============================================================
// AFFICHAGE DE LA MODALE D'ERREUR
// ============================================================

function afficherErreurTeleversement(message) {

    ouvrirModaleErreur(message);

}

// ============================================================
// INITIALISER L'AFFICHAGE DES PIÈCES JUSTIFICATIVES
// ============================================================

afficherListePieces();
mettreAJourNombrePieces();