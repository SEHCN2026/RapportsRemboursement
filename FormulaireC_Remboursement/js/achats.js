/* ==================================================
   FORMULAIRE C — GESTION DES ACHATS
================================================== */

/* ==================================================
   VARIABLES
================================================== */

let numeroAchat = 0;
let numeroAchatPourPieces = null;


/* ==================================================
   FORMATAGE DES MONTANTS
================================================== */

function formaterMontantAchat(montant) {

   return montant.toLocaleString("fr-CA", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
    }) + " $";
}

function convertirMontantAchat(texte) {

    if (!texte) {
	return 0;
    }

    const montant = parseFloat(
	texte
	    .replace(/\s/g, "")
	    .replace(/\$/g, "")
	    .replace(",", ".")
    );

    return Number.isFinite(montant) ? montant : 0;

}

/* ==================================================
   CONFIGURATION DES CALENDRIERS
================================================== */

flatpickr.l10ns.fr.firstDayOfWeek = 0;


/* ==================================================
   MOTIFS TEMPORAIRES DES ACHATS
================================================== */

const motifsAchats = [
    "Achats des délégués",
    "Fournitures de bureau",
    "Fonds d'aide aux élèves",
    "Autre"
];


/* ==================================================
   CRÉATION D'UN ACHAT
================================================== */

function ajouterAchat() {

    const listeAchats = document.getElementById("listeAchats");

    if (!listeAchats) {
	return;
    }

    numeroAchat++;

    const numero = numeroAchat;

    const ligne = document.createElement("div");

    ligne.className = "ligne-achat";
    ligne.dataset.numero = numero;

    const optionsMotifs = [
	'<option value="" disabled selected>Choisir un motif</option>',
	...motifsAchats.map(function(motif) {
	    return `<option value="${motif}">${motif}</option>`;
	})
    ].join("");

    ligne.innerHTML = `
	<div class="entete-achat">
	    <h3 class="numero-achat">Achat nº ${numero}</h3>

	    <button
		type="button"
		class="bouton-supprimer-achat"
		title="Supprimer cet achat"
		aria-label="Supprimer l'achat nº ${numero}"
	    >
		🗑️ Supprimer l'achat
	    </button>
	</div>

	<div class="champs-achat">

	    <div class="date-achat-entete champ-achat">
		<label for="dateAchat${numero}">
		    Date de l'achat <span class="obligatoire">*</span>
		</label>

	 	<input
		    type="text"
		    id="dateAchat${numero}"
		    name="dateAchat${numero}"
		    class="date-achat"
		    placeholder="Choisir une date"
		    aria-label="Date de l'achat nº ${numero}"
		    required
		>
	    </div>

	    <div class="champ-achat champ-motif">
		<label for="motifAchat${numero}">Motif de l'achat <span class="obligatoire">*</span></label>
		<select
		    id="motifAchat${numero}"
		    name="motifAchat${numero}"
		    class="motif-achat placeholder-select"
		    aria-label="Motif de l'achat nº ${numero}"
		    required
		>
		    ${optionsMotifs}
		</select>

		<div
		    class="precision-achat"
		    id="conteneurPrecisionMotif${numero}"
		    style="display: none;"
		>
		    <label for="precisionMotif${numero}">
			Précisez le motif <span class="obligatoire">*</span>
		    </label>

		    <textarea
			type="text"
			id="precisionMotif${numero}"
			name="precisionMotif${numero}"
			class="precision-motif-achat"
			placeholder="Préciser le motif"
			rows="3"
			aria-label="Précision du motif de l'achat nº ${numero}"
			disabled
		    ></textarea>
		</div>
	    </div>

	    <div class="champ-achat">
		<label for="descriptionAchat${numero}">Description de l'achat <span class="obligatoire">*</span></label>
		<input
		    type="text"
		    id="descriptionAchat${numero}"
		    name="descriptionAchat${numero}"
		    class="description-achat"
		    placeholder="Décrire l'achat"
		    aria-label="Description de l'achat nº ${numero}"
		    required
		>
	    </div>

	    <div class="champ-achat">
		<label for="coutAchat${numero}">Coût de l'achat <span class="obligatoire">*</span></label>
		<input
		    type="text"
		    id="coutAchat${numero}"
		    name="coutAchat${numero}"
		    class="cout-achat"
		    inputmode="decimal"
		    placeholder="0,00 $"
		    aria-label="Coût de l'achat nº ${numero}"
		    required
		>
	    </div>
	</div>

	<div class="section-pieces-achat">
	    <div class="resume-pieces-achat">
	        <span>Pièces justificatives</span>
	        <span
		    class="nombre-pieces"
		    id="nombrePieces${numero}"
		    data-numero-achat="${numero}"
		    aria-live="polite"
	    	>0</span>
	    </div>

	    <button
	    	type="button"
	    	class="bouton-ajouter-piece"
	    	title="Ajouter une pièce justificative à cet achat"
	    	aria-label="Ajouter une pièce justificative à l'achat nº ${numero}"
	    >
	    	+ Ajouter une pièce
	    </button>
    	</div>

    `;

    listeAchats.appendChild(ligne);


    /* ----------------------------------------------
       CALENDRIER
    ---------------------------------------------- */

    flatpickr(
        "#dateAchat" + numero,
        {

            locale: "fr",
            dateFormat: "Y-m-d",
            altInput: true,
	    altInputClass: "date-achat-affiche",
            altFormat: "j F Y",
            allowInput: false,

            onReady: function(
                selectedDates,
                dateStr,
                instance
            ) {

                const bouton =
                    document.createElement("button");


                bouton.type =
                    "button";

                bouton.textContent =
                    "Aujourd'hui";


                bouton.style.width =
                    "100%";

                bouton.style.marginTop =
                    "8px";

                bouton.style.padding =
                    "8px";

                bouton.style.border =
                    "1px solid #ccc";

                bouton.style.borderRadius =
                    "4px";

                bouton.style.backgroundColor =
                    "#f5f5f5";

                bouton.style.cursor =
                    "pointer";


                bouton.addEventListener(
                    "click",
                    function() {

                        instance.setDate(
                            new Date(),
                            true
                        );

                        instance.close();

                    }
                );


                instance.calendarContainer
                    .appendChild(bouton);

            }

        }
    );


    /* ----------------------------------------------
       AFFICHAGE DU CHAMP « AUTRE »
    ---------------------------------------------- */

    const champMotif = document.getElementById(
	"motifAchat" + numero
    );

    const conteneurPrecision = document.getElementById(
	"conteneurPrecisionMotif" + numero
    );

    const champPrecision = document.getElementById(
	"precisionMotif" + numero
    );

    champMotif.addEventListener(
	"change",
	function() {

	    const autreSelectionne = this.value === "Autre";

	    conteneurPrecision.style.display = autreSelectionne
		? "flex"
		: "none";

	    champPrecision.disabled = !autreSelectionne;
	    champPrecision.required = autreSelectionne;

	    if (!autreSelectionne) {
		champPrecision.value = "";
	    }

	}
    );


    /* ----------------------------------------------
       SAISIE DU COÛT
    ---------------------------------------------- */

    const champCout = document.getElementById(
        "coutAchat" + numero
    );

    champCout.addEventListener("input", function () {

        calculerTotalAchats();

    });

    champCout.addEventListener("focus", function () {

        this.value = this.value
            .replace(/\s/g, "")
            .replace(/\$/g, "");

        this.select();

    });

    champCout.addEventListener("blur", function () {

        const montant = convertirMontantAchat(this.value);

        this.value = this.value.trim() === ""
            ? ""
            : formaterMontantAchat(montant);

        calculerTotalAchats();

    });


    /* ----------------------------------------------
       SUPPRESSION DE L'ACHAT
    ---------------------------------------------- */

    const boutonSupprimer = ligne.querySelector(
        ".bouton-supprimer-achat"
    );

    boutonSupprimer.addEventListener("click", function () {

        supprimerAchat(numero);

    });


    /* ----------------------------------------------
       AJOUT DE PIÈCES JUSTIFICATIVES
    ---------------------------------------------- */

    const boutonPieces = ligne.querySelector(
        ".bouton-ajouter-piece"
    );

    boutonPieces.addEventListener("click", function () {

        ouvrirAjoutPieces(numero);

    });


    mettreAJourBoutonsAction();

}


/* ==================================================
   SUPPRESSION D'UN ACHAT
================================================== */

function supprimerAchat(numero) {

    const lignes = document.querySelectorAll(
        "#listeAchats .ligne-achat"
    );

    const ligneCible = Array.from(lignes).find(
        ligne => Number(ligne.dataset.numero) === numero
    );

    if (!ligneCible) {
        return;
    }


    /*
       Si une seule ligne reste, on la vide plutôt
       que de supprimer le dernier achat.
    */

    if (lignes.length === 1) {

        const champDate = document.getElementById(
            "dateAchat" + numero
        );

        const champDescription = document.getElementById(
            "descriptionAchat" + numero
        );

 	const champMotif = document.getElementById(
	    "motifAchat" + numero
	);

	const champPrecision = document.getElementById(
	    "precisionMotif" + numero
	);

	const conteneurPrecision = document.getElementById(
	    "conteneurPrecisionMotif" + numero
	);

	if (champMotif) {
	    champMotif.value = "";
	}

	if (champPrecision) {
	    champPrecision.value = "";
	    champPrecision.disabled = true;
	    champPrecision.required = false;
	}

	if (conteneurPrecision) {
	    conteneurPrecision.style.display = "none";
	}

        const champCout = document.getElementById(
            "coutAchat" + numero
        );

        if (champDate && champDate._flatpickr) {
            champDate._flatpickr.clear();
        } else if (champDate) {
            champDate.value = "";
        }

        if (champDescription) {
            champDescription.value = "";
        }

        if (champCout) {
            champCout.value = "";
        }

        supprimerPiecesAssociees(numero);

    } else {

        supprimerPiecesAssociees(numero);

        ligneCible.remove();

        renumeroterAchats();

    }

    calculerTotalAchats();
    mettreAJourNombrePieces();
    mettreAJourBoutonsAction();

}


/* ==================================================
   RENUMÉROTATION DES ACHATS
================================================== */

function renumeroterAchats() {

    const lignes = document.querySelectorAll(
        "#listeAchats .ligne-achat"
    );

    lignes.forEach(function (ligne, index) {

        const ancienNumero = Number(ligne.dataset.numero);
        const nouveauNumero = index + 1;

        if (ancienNumero !== nouveauNumero) {

            renumeroterPiecesAssociees(
                ancienNumero,
                nouveauNumero
            );

        }

        ligne.dataset.numero = nouveauNumero;

        const numeroAffiche = ligne.querySelector(
            ".numero-achat"
        );

        if (numeroAffiche) {
            numeroAffiche.textContent = 
		`Achat nº ${nouveauNumero}`;
        }


        const champDate = ligne.querySelector(".date-achat");

        if (champDate) {

            champDate.id = "dateAchat" + nouveauNumero;
	    champDate.name = "dateAchat" + nouveauNumero;

            champDate.setAttribute(
                "aria-label",
                "Date de l'achat nº " + nouveauNumero
            );

	    const etiquetteDate = ligne.querySelector(
		'label[for^="dateAchat"]'
	    );

	    if (etiquetteDate) {
		etiquetteDate.htmlFor =
		    "dateAchat" + nouveauNumero;
	    }

        }


        /* ----------------------------------------------
           RENUMÉROTATION DU MOTIF
        ---------------------------------------------- */

	const champMotif = ligne.querySelector(".motif-achat");

	if (champMotif) {
	
	    champMotif.id = "motifAchat" + nouveauNumero;
	    champMotif.name = "motifAchat" + nouveauNumero;

	    champMotif.setAttribute(
		"aria-label",
		"Motif de l'achat nº " + nouveauNumero
	    );

	    const etiquetteMotif = ligne.querySelector(
		'label[for^="motifAchat"]'
	    );

	    if (etiquetteMotif) {
		etiquetteMotif.htmlFor =
		    "motifAchat" + nouveauNumero;
	    }
	}


        /* ----------------------------------------------
           RENUMÉROTATION DE LA PRÉCISION DU MOTIF
        ---------------------------------------------- */

	const conteneurPrecision =
	    ligne.querySelector(".precision-achat");

	const champPrecision =
	    ligne.querySelector(".precision-motif-achat");

	if (conteneurPrecision) {
	
	    conteneurPrecision.id =
		"conteneurPrecisionMotif" + nouveauNumero;

	}

	if (champPrecision) {
	
	    champPrecision.id = 
		"precisionMotif" + nouveauNumero;

	    champPrecision.name = 
		"precisionMotif" + nouveauNumero;

	    champPrecision.setAttribute( 
		"aria-label",
		"Précision du motif de l'achat nº " + nouveauNumero
	    );

	    const etiquettePrecision = ligne.querySelector(
		'label[for^="precisionMotif"]'
	    );

	    if (etiquettePrecision) {
		etiquettePrecision.htmlFor =
		    "precisionMotif" + nouveauNumero;
	    }

	}

        const champDescription =
            ligne.querySelector(".description-achat");

        if (champDescription) {

            champDescription.id =
                "descriptionAchat" + nouveauNumero;

	    champDescription.name =
		"descriptionAchat" + nouveauNumero;

            champDescription.setAttribute(
                "aria-label",
                "Description de l'achat nº " + nouveauNumero
            );

	    const etiquetteDescription = ligne.querySelector(
		'label[for^="descriptionAchat"]'
	    );

	    if (etiquetteDescription) {
		etiquetteDescription.htmlFor =
		    "descriptionAchat" + nouveauNumero;
	    }

        }


        const champCout = ligne.querySelector(".cout-achat");

        if (champCout) {
            champCout.id = "coutAchat" + nouveauNumero;
	    champCout.name = "coutAchat" + nouveauNumero;

	    champCout.setAttribute(
		"aria-label",
		"Coût de l'achat nº " + nouveauNumero
	    );

	    const etiquetteCout = ligne.querySelector(
		'label[for^="coutAchat"]'
	    );

	    if (etiquetteCout) {
		etiquetteCout.htmlFor =
		    "coutAchat" + nouveauNumero;
	    }
        }


        const compteur = ligne.querySelector(".nombre-pieces");

        if (compteur) {

            compteur.id = "nombrePieces" + nouveauNumero;
            compteur.dataset.numeroAchat = nouveauNumero;

        }


        const boutonPieces = ligne.querySelector(
            ".bouton-ajouter-piece"
        );

        if (boutonPieces) {

            boutonPieces.dataset.numeroAchat = nouveauNumero;

            boutonPieces.setAttribute(
                "aria-label",
                "Ajouter une pièce justificative à l'achat nº " +
                    nouveauNumero
            );

            boutonPieces.onclick = function () {
                ouvrirAjoutPieces(nouveauNumero);
            };

        }


        const boutonSupprimer = ligne.querySelector(
            ".bouton-supprimer-achat"
        );

        if (boutonSupprimer) {

            boutonSupprimer.setAttribute(
                "aria-label",
                "Supprimer l'achat nº " + nouveauNumero
            );

            boutonSupprimer.onclick = function () {
                supprimerAchat(nouveauNumero);
            };

        }


        /*
           Après renumérotation, le calendrier est
           conservé et rattaché au champ correspondant.
        */

        if (champDate && champDate._flatpickr) {

            champDate._flatpickr.set("onChange", function () {
                mettreAJourBoutonsAction();
            });

        }

    });

    numeroAchat = lignes.length;

    mettreAJourNombrePieces();

}


/* ==================================================
   TOTAL DES ACHATS
================================================== */

function calculerTotalAchats() {

    const lignes = document.querySelectorAll(
        "#listeAchats .ligne-achat"
    );

    let total = 0;

    lignes.forEach(function (ligne) {

        const champCout = ligne.querySelector(".cout-achat");

        if (champCout) {
            total += convertirMontantAchat(champCout.value);
        }

    });

    const elementTotal = document.getElementById("totalAchats");

    if (elementTotal) {
        elementTotal.textContent = formaterMontantAchat(total);
    }

    if (typeof mettreAJourTotauxVerification === "function") {
        mettreAJourTotauxVerification();
    }

}


/* ==================================================
   OUVRIR LA SÉLECTION DE FICHIERS POUR UN ACHAT
================================================== */

function ouvrirAjoutPieces(numero) {

    const champFichiers = document.getElementById(
        "piecesJustificatives"
    );

    if (!champFichiers) {
        return;
    }

    numeroAchatPourPieces = numero;

    /*
       pieces.js pourra lire cette variable afin
       d'associer les fichiers au bon achat.
    */

    champFichiers.dataset.numeroAchat = numero;

    champFichiers.click();

}


/* ==================================================
   GESTION DES ASSOCIATIONS DES PIÈCES
================================================== */

/*
   Ces fonctions sont prévues pour fonctionner avec
   la version adaptée de pieces.js. Elles reconnaissent
   les deux structures :
   - un objet { fichier, numeroAchat }
   - un objet File portant _numeroAchat
*/

function obtenirNumeroAchatPiece(element) {

    if (!element) {
        return null;
    }

    if (element.numeroAchat !== undefined) {
        return Number(element.numeroAchat);
    }

    if (element._numeroAchat !== undefined) {
        return Number(element._numeroAchat);
    }

    return null;

}


function supprimerPiecesAssociees(numero) {

    const champFichiers = document.getElementById(
        "piecesJustificatives"
    );

    if (
        !champFichiers ||
        !Array.isArray(champFichiers._fichiersSelectionnes)
    ) {
        return;
    }

    champFichiers._fichiersSelectionnes =
        champFichiers._fichiersSelectionnes.filter(function(element) {

            return Number(element.numeroAchat) !== numero;

        });

    synchroniserChampFichiers();
    afficherListePieces();
    mettreAJourNombrePieces();

}


function renumeroterPiecesAssociees(
    ancienNumero,
    nouveauNumero
) {

    const champFichiers = document.getElementById(
        "piecesJustificatives"
    );

    if (
        !champFichiers ||
        !Array.isArray(champFichiers._fichiersSelectionnes)
    ) {
        return;
    }

    champFichiers._fichiersSelectionnes.forEach(function(element) {

        if (Number(element.numeroAchat) === ancienNumero) {
            element.numeroAchat = nouveauNumero;
        }

    });

    synchroniserChampFichiers();
    afficherListePieces();
    mettreAJourNombrePieces();

}


function reconstruireListePieces() {

    if (typeof afficherListePieces === "function") {
        afficherListePieces();
    }

    mettreAJourNombrePieces();

}


/* ==================================================
   COMPTEUR DE PIÈCES PAR ACHAT
================================================== */

function mettreAJourNombrePieces() {

    const compteurs = document.querySelectorAll(
        "#listeAchats .nombre-pieces"
    );

    compteurs.forEach(function (compteur) {

        compteur.textContent = "0";
        compteur.classList.remove("pieces-presentes");

    });


    const lignesPieces = document.querySelectorAll(
        "#listePiecesJustificatives .piece-justificative"
    );

    lignesPieces.forEach(function (lignePiece) {

        const numero = Number(
            lignePiece.dataset.numeroAchat
        );

        if (!numero) {
            return;
        }

        const compteur = document.getElementById(
            "nombrePieces" + numero
        );

        if (!compteur) {
            return;
        }

        const nombreActuel = Number(compteur.textContent) || 0;

        compteur.textContent = nombreActuel + 1;
        compteur.classList.add("pieces-presentes");

    });

}


/* ==================================================
   MISE À JOUR DES BOUTONS D'ACTION
================================================== */

function mettreAJourBoutonsAction() {

    /*
       Les boutons finaux ne sont pas activés ou
       désactivés ici : la navigation et les
       validations du formulaire C s'en chargent.
    */

}


/* ==================================================
   INITIALISATION
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const boutonAjouter = document.getElementById(
        "boutonAjouterAchats"
    );

    if (boutonAjouter) {

        boutonAjouter.addEventListener("click", function () {
            ajouterAchat();
        });

    }

    /*
       Le conteneur est vide dans le HTML :
       on crée donc la première ligne.
    */

    if (
        document.getElementById("listeAchats") &&
        document.querySelectorAll("#listeAchats .ligne-achat").length === 0
    ) {

        ajouterAchat();

    }

    calculerTotalAchats();

});
