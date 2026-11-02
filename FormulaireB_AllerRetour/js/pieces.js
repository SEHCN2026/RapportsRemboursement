// ============================================================
// GESTION DES PIÈCES JUSTIFICATIVES
// ============================================================


// ============================================================
// ICÔNE SELON LE TYPE DE FICHIER
// ============================================================

function obtenirIconeFichier(nomFichier) {

    const extension =
        nomFichier
            .split(".")
            .pop()
            .toLowerCase();


    if (
        extension === "pdf"
    ) {

        return "📑";

    }


    if (
        ["jpg", "jpeg", "png", "gif", "svg"].includes(
            extension
        )
    ) {

        return "🖼️";

    }


    if (
        ["doc", "docx"].includes(
            extension
        )
    ) {

        return "📄";

    }


    if (
        ["xls", "xlsx"].includes(
            extension
        )
    ) {

        return "📊";

    }


    return "📚";

}


// ============================================================
// PARAMÈTRES DE TÉLÉVERSEMENT
// ============================================================

const NOMBRE_MAX_FICHIERS = 10;

const TAILLE_MAX_FICHIERS =
    10 * 1024 * 1024;

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
// SÉLECTION DES FICHIERS
// ============================================================

const champFichiers =
    document.getElementById(
        "piecesJustificatives"
    );


if (champFichiers) {

    champFichiers.addEventListener(
        "change",
        function() {

            const champ =
                this;


            // ------------------------------------------------
            // INITIALISER LA LISTE DES FICHIERS
            // ------------------------------------------------

            if (
                !champ._fichiersSelectionnes
            ) {

                champ._fichiersSelectionnes = [];

            }


            const fichiersExistants =
                champ._fichiersSelectionnes;


            // ------------------------------------------------
            // AJOUT DES NOUVEAUX FICHIERS
            // ------------------------------------------------

            Array.from(
                champ.files
            ).forEach(
                function(fichier) {

                    const existeDeja =
                        fichiersExistants.some(
                            function(fichierExistant) {

                                return (
                                    fichierExistant.name === fichier.name &&
                                    fichierExistant.size === fichier.size &&
                                    fichierExistant.lastModified === fichier.lastModified
                                );

                            }
                        );


                    // ------------------------------------------------
                    // FICHIER EN DOUBLE
                    // ------------------------------------------------

                    if (
                        existeDeja
                    ) {

                        afficherErreurTeleversement(
                            "Le fichier « " +
                            fichier.name +
                            " » a déjà été sélectionné."
                        );

                        return;

                    }


                    // ------------------------------------------------
                    // TAILLE MAXIMALE
                    // ------------------------------------------------

                    if (
                        fichier.size > TAILLE_MAX_FICHIERS
                    ) {

                        afficherErreurTeleversement(
                            "Le fichier « " +
                            fichier.name +
                            " » dépasse la taille maximale de 10 Mo."
                        );

                        return;

                    }


                    // ------------------------------------------------
                    // FORMAT ACCEPTÉ
                    // ------------------------------------------------

                    const extension =
                        fichier.name
                            .split(".")
                            .pop()
                            .toLowerCase();


                    if (
                        !EXTENSIONS_FICHIERS.includes(
                            extension
                        )
                    ) {

                        afficherErreurTeleversement(
                            "Le type de fichier « " +
                            fichier.name +
                            " » n'est pas accepté."
                        );

                        return;

                    }


                    // ------------------------------------------------
                    // NOMBRE MAXIMAL DE FICHIERS
                    // ------------------------------------------------

                    if (
                        fichiersExistants.length >=
                        NOMBRE_MAX_FICHIERS
                    ) {

                        afficherErreurTeleversement(
                            "Vous pouvez sélectionner un maximum de 10 fichiers!"
                        );

                        return;

                    }


                    // ------------------------------------------------
                    // AJOUT DU FICHIER
                    // ------------------------------------------------

                    fichiersExistants.push(
                        fichier
                    );

                }
            );


            // ------------------------------------------------
            // RECONSTRUIT LA LISTE DES FICHIERS DU CHAMP
            // ------------------------------------------------

            const transfert =
                new DataTransfer();


            fichiersExistants.forEach(
                function(fichier) {

                    transfert.items.add(
                        fichier
                    );

                }
            );


            champ.files =
                transfert.files;


            // ------------------------------------------------
            // RÉCUPÈRE LES CONTENEURS
            // ------------------------------------------------

            const conteneur =
                document.getElementById(
                    "listePiecesJustificatives"
                );


            const enTete =
                document.getElementById(
                    "entetePiecesJustificatives"
                );


            if (
                !conteneur ||
                !enTete
            ) {

                return;

            }


            const resumeFichiers =
                document.getElementById(
                    "resumeFichiers"
                );


            // ------------------------------------------------
            // RECONSTRUIT L'AFFICHAGE
            // ------------------------------------------------

            conteneur.innerHTML =
                "";


            fichiersExistants.forEach(
                function(fichier, index) {

                    const ligne =
                        document.createElement(
                            "div"
                        );


                    ligne.className =
                        "piece-justificative";


                    // ------------------------------------------------
                    // INFORMATIONS DU FICHIER
                    // ------------------------------------------------

                    const informations =
                        document.createElement(
                            "div"
                        );


                    informations.className =
                        "informations-fichier";


                    // ------------------------------------------------
                    // ICÔNE
                    // ------------------------------------------------

                    const icone =
                        document.createElement(
                            "span"
                        );


                    icone.className =
                        "icone-fichier";


                    icone.textContent =
                        obtenirIconeFichier(
                            fichier.name
                        );


                    // ------------------------------------------------
                    // NOM DU FICHIER
                    // ------------------------------------------------

                    const nom =
                        document.createElement(
                            "span"
                        );


                    nom.className =
                        "nom-fichier";


                    nom.textContent =
                        fichier.name;


                    // ------------------------------------------------
                    // TAILLE DU FICHIER
                    // ------------------------------------------------

                    const taille =
                        document.createElement(
                            "span"
                        );


                    taille.className =
                        "taille-fichier";


                    taille.textContent =
                        formaterTailleFichier(
                            fichier.size
                        );


                    // ------------------------------------------------
                    // ASSEMBLE LES INFORMATIONS
                    // ------------------------------------------------

                    const details =
                        document.createElement(
                            "div"
                        );


                    details.className =
                        "details-fichier";


                    details.appendChild(
                        nom
                    );


                    details.appendChild(
                        taille
                    );


                    informations.appendChild(
                        icone
                    );


                    informations.appendChild(
                        details
                    );


                    // ------------------------------------------------
                    // BOUTON SUPPRIMER
                    // ------------------------------------------------

                    const boutonSupprimer =
                        document.createElement(
                            "button"
                        );


                    boutonSupprimer.type =
                        "button";


                    boutonSupprimer.className =
                        "supprimer-piece";


                    boutonSupprimer.textContent =
                        "🗑";


                    boutonSupprimer.setAttribute(
                        "aria-label",
                        "Supprimer " + fichier.name
                    );


                    // ------------------------------------------------
                    // SUPPRESSION DU FICHIER
                    // ------------------------------------------------

                    boutonSupprimer.addEventListener(
                        "click",
                        function() {

                            fichiersExistants.splice(
                                index,
                                1
                            );

        	    // ------------------------------------------------
        	    // RÉINITIALISE LA LISTE INTERNE
        	    // AVANT DE RECONSTRUIRE LE CHAMP
        	    // ------------------------------------------------

		    champ._fichiersSelectionnes =
			[];


                            const nouveauTransfert =
                                new DataTransfer();


                            fichiersExistants.forEach(
                                function(fichierRestant) {

                                    nouveauTransfert.items.add(
                                        fichierRestant
                                    );

                                }
                            );


                            champ.files =
                                nouveauTransfert.files;


                            champ.dispatchEvent(
                                new Event(
                                    "change"
                                )
                            );

                        }
                    );


                    // ------------------------------------------------
                    // ASSEMBLE LA LIGNE
                    // ------------------------------------------------

                    ligne.appendChild(
                        informations
                    );


                    ligne.appendChild(
                        boutonSupprimer
                    );


                    conteneur.appendChild(
                        ligne
                    );

                }
            );


            // ------------------------------------------------
            // AFFICHAGE / MASQUAGE DE L'EN-TÊTE
            // ------------------------------------------------

            if (
                fichiersExistants.length > 0
            ) {

                enTete.style.display =
                    "grid";


                // ------------------------------------------------
                // CALCUL DE LA TAILLE TOTALE
                // ------------------------------------------------

                let tailleTotale =
                    0;


                fichiersExistants.forEach(
                    function(fichier) {

                        tailleTotale +=
                            fichier.size;

                    }
                );


                // ------------------------------------------------
                // RÉSUMÉ DES FICHIERS
                // ------------------------------------------------

                if (
                    resumeFichiers
                ) {

                    resumeFichiers.textContent =
                        fichiersExistants.length +
                        (
                            fichiersExistants.length === 1
                                ? " fichier sélectionné"
                                : " fichiers sélectionnés"
                        ) +
                        " · " +
                        formaterTailleFichier(
                            tailleTotale
                        ) +
                        " au total";

                }

            }
            else {

                enTete.style.display =
                    "none";


                if (
                    resumeFichiers
                ) {

                    resumeFichiers.textContent =
                        "";

                }

            }

        }
    );

}


// ============================================================
// GLISSER-DÉPOSER
// ============================================================

const zoneTeleversement =
    document.querySelector(
        "#etape4 .zone-televersement"
    );


if (
    zoneTeleversement &&
    champFichiers
) {

    // --------------------------------------------------------
    // SURVOL DE LA ZONE
    // --------------------------------------------------------

    zoneTeleversement.addEventListener(
        "dragover",
        function(evenement) {

            evenement.preventDefault();
            evenement.stopPropagation();


            zoneTeleversement.classList.add(
                "dragover"
            );

        }
    );


    // --------------------------------------------------------
    // SORTIE DE LA ZONE
    // --------------------------------------------------------

    zoneTeleversement.addEventListener(
        "dragleave",
        function(evenement) {

            evenement.preventDefault();
            evenement.stopPropagation();


            zoneTeleversement.classList.remove(
                "dragover"
            );

        }
    );


    // --------------------------------------------------------
    // DÉPÔT DES FICHIERS
    // --------------------------------------------------------

    zoneTeleversement.addEventListener(
        "drop",
        function(evenement) {

            evenement.preventDefault();
            evenement.stopPropagation();


            zoneTeleversement.classList.remove(
                "dragover"
            );


            const fichiers =
                evenement.dataTransfer.files;


            if (
                !fichiers ||
                fichiers.length === 0
            ) {

                return;

            }


            const transfert =
                new DataTransfer();


            // ------------------------------------------------
            // CONSERVATION DES FICHIERS EXISTANTS
            // ------------------------------------------------

            if (
                champFichiers._fichiersSelectionnes
            ) {

                champFichiers._fichiersSelectionnes.forEach(
                    function(fichier) {

                        transfert.items.add(
                            fichier
                        );

                    }
                );

            }


            // ------------------------------------------------
            // AJOUT DES FICHIERS DÉPOSÉS
            // ------------------------------------------------

            Array.from(
                fichiers
            ).forEach(
                function(fichier) {

                    const existeDeja =
                        champFichiers._fichiersSelectionnes?.some(
                            function(fichierExistant) {

                                return (
                                    fichierExistant.name === fichier.name &&
                                    fichierExistant.size === fichier.size &&
                                    fichierExistant.lastModified === fichier.lastModified
                                );

                            }
                        );


                    if (
                        !existeDeja
                    ) {

                        transfert.items.add(
                            fichier
                        );

                    }

                }
            );


            // ------------------------------------------------
            // METTRE À JOUR LE CHAMP DE FICHIERS
            // ------------------------------------------------

            champFichiers.files =
                transfert.files;


            champFichiers.dispatchEvent(
                new Event(
                    "change"
                )
            );

        }
    );

}


// ============================================================
// FORMATAGE DE LA TAILLE
// ============================================================

function formaterTailleFichier(taille) {

    if (
        taille < 1024
    ) {

        return taille + " octets";

    }


    if (
        taille < 1024 * 1024
    ) {

        return (
            taille / 1024
        ).toFixed(0) + " Ko";

    }


    return (
        taille / (1024 * 1024)
    ).toFixed(1) + " Mo";

}


// ============================================================
// AFFICHAGE DE LA MODALE D'ERREUR
// ============================================================

function afficherErreurTeleversement(message) {

    ouvrirModaleErreur(
        message
    );

}