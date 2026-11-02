/* ================================
   AFFICHAGE DES MONTANTS
================================ */

function afficherMontant(montant) {

    return Number(montant).toLocaleString(
	"fr-CA",
	{
	    minimumFractionDigits: 2,
	    maximumFractionDigits: 2
	}
    ) + " $";
}


/* ================================
   FORMATAGE D'UN CHAMP À LA SORTIE
================================ */

function configurerChampMontant(champ) {

    if (!champ || champ.dataset.formatMontant === "true") {
	return;
    }

    champ.dataset.formatMontant = "true";

    champ.addEventListener("focus", function() {
	this.value = this.value
            .replace(/[\s\u00A0\u202F]/g, "")
            .replace(/\$/g, "")
            .replace(",", ".");
    });

    champ.addEventListener("blur", function() {
	const texte = this.value.trim();

	if (texte === "") {
	    this.value = "";
	    return;
	}

	const montant = montantEnNombre(texte);

	this.value = afficherMontant(montant);

    });

}


/* ================================
   CONVERSION D'UN MONTANT EN NOMBRE
================================ */

function montantEnNombre(texte) {

    if (texte === null || texte === undefined) {
	return 0;
    }

    const valeur = String(texte)
 	.replace(/[\s\u00A0\u202F]/g, "")
	.replace(/\$/g, "")
	.replace(",", ".");

    const montant = parseFloat(valeur);

    return Number.isFinite(montant) 
	? montant
	: 0;

}


/* ================================
   OUTIL : HEURE
================================ */

function heureEnMinutes(heure) {
    const [heures, minutes] = heure.split(":").map(Number);
    return heures * 60 + minutes;
}


/* ================================
   REPAS ADMISSIBLES
================================ */

function verifierRepas() {

    const heureDepart = 
	document.getElementById("heureDepart").value;

    const heureRetour = 
	document.getElementById("heureRetour").value;

    const dejeuner =
        document.getElementById("dejeuner");

    const diner =
        document.getElementById("diner");

    const souper =
        document.getElementById("souper");

    const collation =
        document.getElementById("collation");

    if (!heureDepart || !heureRetour) {

        if (dejeuner) {
	    dejeuner.disabled = true;
	    dejeuner.checked = false;
	}

        if (diner) {
	    diner.disabled = true;
	    diner.checked = false;
	}

        if (souper) {
	    souper.disabled = true;
	    souper.checked = false;
	}

        if (collation) {
	    collation.disabled = true;
	    collation.checked = false;
	}

        afficherMontantsRepas();
	calculerTotalRepas();

	return;

    }
   

    const depart =
	heureEnMinutes(heureDepart);

    const retour =
	heureEnMinutes(heureRetour);

    
    const dejeunerAdmissible =
        depart <= heureEnMinutes("07:30") &&
        retour >= heureEnMinutes("09:00");

    const dinerAdmissible =
        depart <= heureEnMinutes("12:00") &&
        retour >= heureEnMinutes("12:30");

    const souperAdmissible =
        depart <= heureEnMinutes("18:00") &&
        retour >= heureEnMinutes("18:30");

    const collationAdmissible =
        depart <= heureEnMinutes("22:00") &&
        retour >= heureEnMinutes("22:00");

    if (dejeuner) {

        dejeuner.disabled = 
	    !dejeunerAdmissible;

        if (!dejeunerAdmissible) {
            dejeuner.checked = false;
        }
    }


    if (diner) {

        diner.disabled = 
	    !dinerAdmissible;

        if (!dinerAdmissible) {
            diner.checked = false;
        }
    }


    if (souper) {

        souper.disabled = 
	    !souperAdmissible;

        if (!souperAdmissible) {
            souper.checked = false;
        }
    }


    if (collation) {

        collation.disabled = 
	    !collationAdmissible;

        if (!collationAdmissible) {
            collation.checked = false;
        }
    }


    afficherMontantsRepas();
    calculerTotalRepas();
}


/* ================================
   MONTANTS DES REPAS
================================ */

function afficherMontantsRepas() {

    const dateActivite =
	document.getElementById("dateActivite")?.value;

    if (!dateActivite) {
	return;
    }


    const annee = 
	dateActivite.substring(0, 4);

    const parametres =
	donneesParametres[annee];

    if (!parametres) {
	return;
    }


    const montantDejeuner =
        document.getElementById("montantDejeuner");

    const montantDiner =
        document.getElementById("montantDiner");

    const montantSouper =
        document.getElementById("montantSouper");

    const montantCollation =
        document.getElementById("montantCollation");


    if (montantDejeuner) {
        montantDejeuner.textContent =
            afficherMontant(
                parametres.dejeuner
            );
    }

    if (montantDiner) {
        montantDiner.textContent =
            afficherMontant(
                parametres.diner
            );
    }

    if (montantSouper) {
        montantSouper.textContent =
            afficherMontant(
                parametres.souper
            );
    }

    if (montantCollation) {
        montantCollation.textContent =
            afficherMontant(
                parametres.collation
            );
    }
}


/* ================================
   TOTAL REPAS
================================ */

function calculerTotalRepas() {

    const dateActivite =
        document.getElementById("dateActivite")?.value;

    if (!dateActivite) {
        return;
    }

    const annee =
        dateActivite.substring(0, 4);

    const parametres =
        donneesParametres[annee];

    if (!parametres) {
        return;
    }


    const dejeuner =
        document.getElementById("dejeuner")?.checked || false;

    const diner =
        document.getElementById("diner")?.checked || false;

    const souper =
        document.getElementById("souper")?.checked || false;

    const collation =
        document.getElementById("collation")?.checked || false;


    let total = 0;


    if (dejeuner) {
        total += parametres.dejeuner;
    }

    if (diner) {
        total += parametres.diner;
    }

    if (souper) {
        total += parametres.souper;
    }

    if (collation) {
        total += parametres.collation;
    }


    const affichage =
        document.getElementById("totalRepas");


    if (affichage) {
        affichage.textContent =
            afficherMontant(total);
    }
}

/* ================================
   ÉCOUTEURS DES CASES DE REPAS
================================ */

document.getElementById("dejeuner")
    ?.addEventListener(
	"change",
	function() {
	    calculerTotalRepas();
	    calculerTotalJournee();
	}
    );

document.getElementById("diner")
    ?.addEventListener(
	"change",
	function() {
	    calculerTotalRepas();
	    calculerTotalJournee();
	}
    );

document.getElementById("souper")
    ?.addEventListener(
	"change",
	function() {
	    calculerTotalRepas();
	    calculerTotalJournee();
	}
    );

document.getElementById("collation")
    ?.addEventListener(
	"change",
	function() {
	    calculerTotalRepas();
	    calculerTotalJournee();
	}
    );


/* ================================
   ARRÊTS INTERMÉDIAIRES
================================ */

function ajouterListeArret(conteneurId, direction) {

    const conteneur = document.getElementById(conteneurId);
    const listeActivite = document.getElementById("villeActivite");

    if (!conteneur || !listeActivite) {
	return;
    }


    //Créer la ligne d'arrêt
    const ligne = document.createElement("div");
    ligne.className = "ligne-arret";

    // Créerle libellé de l'arrêt
    const label = document.createElement("label");
    label.className = "label-arret";
    label.textContent = "";

    // Créer la liste déroulante
    const select = document.createElement("select");
    select.name = "villeArret" + direction + "[]";
    select.className = "ville-arret";
    select.required = false;

    // Option vide par défaut
    const optionVide = document.createElement("option");
    optionVide.value = "";
    optionVide.textContent = "Sélectionner une ville";
    optionVide.disabled = true;
    optionVide.selected = true;

    select.appendChild(optionVide);

    select.classList.add("placeholder-select");

    select.addEventListener("change", function() {
	
	if (select.value === "") {
	    select.classList.add("placeholder-select");
	} else {
	    select.classList.remove("placeholder-select");
	}

	calculerKilometrage();
	calculerTotalJournee();

    });

    // Reprendre les villes
    Array.from(listeActivite.options).forEach(option => {

	if (!option.value) {
	    return;
 	}

	const nouvelleOption = document.createElement("option");
	nouvelleOption.value = option.value;
 	nouvelleOption.textContent = option.textContent.trim();

	select.appendChild(nouvelleOption);
    });

    //Bouton pour supprimer l'arrêt
    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.type="button";
    boutonSupprimer.textContent="🗑";
    boutonSupprimer.className = "bouton-supprimer-transport";
    boutonSupprimer.setAttribute("aria-label", "Supprimer cet arrêt");
    boutonSupprimer.title = "Supprimer cet arrêt";

    boutonSupprimer.addEventListener("click", function() {

	ligne.remove();
	renumeroterArrets(conteneur);

	calculerKilometrage();
	calculerTotalJournee();
    });

    ligne.appendChild(label);
    ligne.appendChild(select);
    ligne.appendChild(boutonSupprimer);

    conteneur.appendChild(ligne);


    renumeroterArrets(conteneur);

    calculerKilometrage();
    calculerTotalJournee();

}


/* ================================
   NUMÉROTATION DES ARRÊTS
================================ */

function renumeroterArrets(conteneur) {

    const lignes = conteneur.querySelectorAll(".ligne-arret");

    lignes.forEach(function(ligne, index) {

	const label = ligne.querySelector(".label-arret");

	if (label) {
	    label.textContent = "Arrêt " + (index + 1);
	}

    });

}


/* ================================
   BOUTONS D'AJOUT DES ARRÊTS
================================ */

document.getElementById("ajouterArretAller")
    ?.addEventListener("click", function() {
	ajouterListeArret("conteneurArretsAller", "Aller");
    });

document.getElementById("ajouterArretRetour")
    ?.addEventListener("click", function() {
	ajouterListeArret("conteneurArretsRetour", "Retour");
    });


/* ================================
   TYPE DE TRAJET
================================ */

function gererTypeTrajet() {

    const trajetAvecArrets =
	document.getElementById(
	    "trajetAvecArrets"
	)?.checked;

    const sectionArretsAller =
	document.getElementById(
	    "sectionArretsAller"
	);

    const sectionArretsRetour =
	document.getElementById(
	    "sectionArretsRetour"
	);

    if (sectionArretsAller) {
	sectionArretsAller.hidden = !trajetAvecArrets;
    }

    if (sectionArretsRetour) {
	sectionArretsRetour.hidden = !trajetAvecArrets;
    }

}


/* ================================
   ÉCOUTEURS DU TYPE DE TRAJET
================================ */

const trajetDirect = 
    document.getElementById(
	"trajetDirect"
    );

if (trajetDirect) {
    trajetDirect.checked = true;
}

document.querySelectorAll(
    'input[name="typeTrajet"]'
	).forEach(function(radio) {

	    radio.addEventListener("change", function() {

		gererTypeTrajet();

		calculerKilometrage();
		calculerTotalJournee();
	    });

	});

gererTypeTrajet();



/* ================================
   TOTAL KILOMÉTRAGE
================================ */

function calculerKilometrage() {

    const villeDepart =
        document.getElementById("villeDepart")?.value;

    const villeActivite =
        document.getElementById("villeActivite")?.value;

    const affichageKilometrage =
        document.getElementById("kilometrage");

    const affichageTaux =
        document.getElementById("tauxKilometrique");

    const affichageTotalDeplacements =
        document.getElementById("totalDeplacements");


    if (!affichageKilometrage) {
        return;
    }


    // --------------------------------------------------------
    // Fonction de remise à zéro des affichages
    // --------------------------------------------------------

    function reinitialiserCalcul() {

	affichageKilometrage.textContent = "0,0 km";

	if (affichageTaux) {
	    affichageTaux.textContent ="0,00 $ / km";
	}

	if (affichageTotalDeplacements) {
	    affichageTotalDeplacements.textContent = "0,00 $";
	}
    }

    if (!villeDepart || !villeActivite) {
	reinitialiserCalcul();
	return;

    }


    // --------------------------------------------------------
    // 1. CALCUL DE LA DISTANCE
    // --------------------------------------------------------

    let kilometrageAllerRetour = 0;

    const trajetAvecArrets =
	document.getElementById("trajetAvecArrets")?.checked;

    if (!trajetAvecArrets) {



        // ----------------------------------------------------
        // ALLER-RETOUR DIRECT
        // Conserver le calcul actuel tel quel
        // ----------------------------------------------------


    	const distance =
            donneesDistances[villeDepart]?.[villeActivite];


    	if (distance === undefined) {

            console.warn(
            	`Aucune distance trouvée pour ${villeDepart} → ${villeActivite}`
            );

	    reinitialiserCalcul();
	    return;
	}

	kilometrageAllerRetour = distance * 2;

    } else {


        // ----------------------------------------------------
        // ALLER-RETOUR AVEC ARRÊTS INTERMÉDIAIRES
        // ----------------------------------------------------

	const arretsAller = Array.from(
	    document.querySelectorAll(
		"#conteneurArretsAller .ville-arret"
	    )
	).map(function(select) {
	    return select.value;
	});

	const arretsRetour = Array.from(
	    document.querySelectorAll(
		"#conteneurArretsRetour .ville-arret"
	    )
	).map(function(select) {
	    return select.value;
	});


        // Bloquer le calcul si un arrêt n'est pas sélectionné

	if (
	    arretsAller.some(ville => !ville) ||
	    arretsRetour.some(ville => !ville)
	) {
	    reinitialiserCalcul();
	    return;
	}


        // Construire les parcours dans l'ordre sélectionné

	const parcoursAller = [
	    villeDepart,
	    ...arretsAller,
	    villeActivite
	];

	const parcoursRetour = [
	    villeActivite,
	    ...arretsRetour,
	    villeDepart
	];


        // Additionner les distances de chaque segment

	function calculerDistanceParcours(parcours) {

	    let distanceTotale = 0;

	    for (let i = 0; i < parcours.length - 1; i++) {

		const villeOrigine = parcours[i];
		const villeDestination = parcours[i + 1];

		const distanceSegment =
		    donneesDistances[villeOrigine]?.[villeDestination];

		if (
		    !Number.isFinite(distanceSegment) ||
		    distanceSegment < 0
		) {

		    console.warn(
			`Distance introuvable pour ${villeOrigine} → ${villeDestination}`
		    );

		    return null;
		}

		distanceTotale += distanceSegment;
	    }

	    return distanceTotale;
	}

	const distanceAller =
	    calculerDistanceParcours(parcoursAller);

	const distanceRetour =
	    calculerDistanceParcours(parcoursRetour);


        // Bloquer le calcul si une distance est manquante

	if (
	    distanceAller === null ||
	    distanceRetour === null
	) {
	    reinitialiserCalcul();
	    return;
	}

	kilometrageAllerRetour =
	    distanceAller + distanceRetour;

    }


    // --------------------------------------------------------
    // 2. AFFICHER LE KILOMÉTRAGE
    // --------------------------------------------------------

    affichageKilometrage.textContent =
        kilometrageAllerRetour.toLocaleString(
            "fr-CA",
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }
        ) + " km";


    // --------------------------------------------------------
    // 3. DÉTERMINER LE TAUX KILOMÉTRIQUE
    // Conserver la logique actuelle
    // --------------------------------------------------------

    const dateActivite =
        document.getElementById("dateActivite")?.value;

    let tauxKilometrique = 0;

    if (dateActivite) {

        const annee =
            dateActivite.substring(0, 4);

        const parametres =
            donneesParametres[annee];

        if (parametres) {
            tauxKilometrique =
                parametres.tauxKilometrage;
        }
    }


    if (affichageTaux) {

        affichageTaux.textContent =
            tauxKilometrique.toLocaleString(
                "fr-CA",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ) + " $ / km";
    }


    // --------------------------------------------------------
    // 4. CALCULER LE MONTANT TOTAL
    // --------------------------------------------------------

    const totalDeplacements =
        kilometrageAllerRetour *
        tauxKilometrique;


    if (affichageTotalDeplacements) {

        affichageTotalDeplacements.textContent =
            afficherMontant(totalDeplacements);
    }
}


/* ================================
   TOTAL LOCATION AUTOMOBILE
================================ */

function calculerLocation() {

    const locationCout =
        montantEnNombre(
            document.getElementById("locationCout")?.value
        );


    const locationEssence =
        montantEnNombre(
            document.getElementById("locationEssence")?.value
        );

    const total = locationCout + locationEssence;

    const affichage =
	document.getElementById(
	    "totalLocation"
	);

    if (affichage) {
	affichage.textContent = afficherMontant(total);
    }

}


/* ================================
   TOTAL TRANSPORTS PUBLICS
================================ */

function calculerTransportsPublics() {

    let total = 0;

    document.querySelectorAll(	
	'#conteneurTransportsPublics input[id^="montantTransportPublic_"]'
    ).forEach(function(champ) {

	total += montantEnNombre(champ.value);

    });


    const affichage =
        document.getElementById("totalTransportsPublics");


    if (affichage) {

        affichage.textContent =
            afficherMontant(total);
    }
}


/* ================================
   TOTAL AUTRES TRANSPORTS
================================ */

function calculerAutresTransports() {

    calculerLocation();
    calculerTransportsPublics();

    const totalLocation = 
	montantEnNombre(
	    document.getElementById(
		"totalLocation").textContent
	);

    const totalTransportsPublics =
	montantEnNombre(
	    document.getElementById(
		"totalTransportsPublics").textContent
	);

    const total = totalLocation + totalTransportsPublics;

    const affichage =
	document.getElementById(
 	    "totalRapportAutresTransports");

    if (affichage) {
	affichage.textContent = afficherMontant(total);
    }

}


/* ================================
   LOCATION — ESSENCE
================================ */

const locationCout =
    document.getElementById("locationCout");

const locationEssence =
    document.getElementById("locationEssence");

if (locationCout && locationEssence) {

    function mettreAJourLocationEssence() {

        const montantLocation =
            montantEnNombre(locationCout.value);

        const locationValide =
            locationCout.value.trim() !== "" &&
            Number.isFinite(montantLocation) &&
            montantLocation > 0;

        locationEssence.disabled =
            !locationValide;

        locationEssence.placeholder =
            locationValide
                ? "Inscrire le montant"
                : "";

        if (!locationValide) {

            locationEssence.value = "";

        }

        calculerAutresTransports();
        calculerTotalJournee();

    }

    locationCout.addEventListener(
        "input",
        mettreAJourLocationEssence
    );

    // Appliquer l'état initial
    mettreAJourLocationEssence();

}

/* ================================
   ÉCOUTEURS TRANSPORTS
================================ */


// ------------------------------------------------
// LOCATION AUTOMOBILE
// ------------------------------------------------

[
    "locationCout",
    "locationEssence"
].forEach(function(id) {

	document.getElementById(id)
	    ?.addEventListener(
		"input",
		function() {

		    calculerAutresTransports();
		    calculerTotalJournee();
	    });

});


// ------------------------------------------------
// TRANSPORTS PUBLICS — CALCUL DES MONTANTS
// ------------------------------------------------

const conteneurTransportsPublics =
    document.getElementById("conteneurTransportsPublics");

if (conteneurTransportsPublics) {

    conteneurTransportsPublics.addEventListener(
	"input",
	function(event) {

	    if (
		event.target.matches(
		    'input[id^="montantTransportPublic_"]'
	 	)
	    ) {
		calculerAutresTransports();
		calculerTotalJournee();
	    }

	}
    );


    // --------------------------------------------
    // AJOUTER UNE LIGNE DE TRANSPORT
    // --------------------------------------------

    const boutonAjouterTransport =
	document.querySelector(".bouton-ajouter-transport");

    if (boutonAjouterTransport) {

	boutonAjouterTransport.addEventListener(
	    "click",
	    function() {

		let numeroMaximum = 0;

		conteneurTransportsPublics
		    .querySelectorAll(".transport-public-ligne")
		    .forEach(function(ligneExistante) {

			const champMontant =
			    ligneExistante.querySelector(
				'input[id^="montantTransportPublic_"]'
			    );

			if (champMontant) {

			    const correspondance =
				champMontant.id.match(/_(\d+)$/);

			    if (correspondance) {

				numeroMaximum = Math.max(
				    numeroMaximum,
				    Number(correspondance[1])
				);

			    }

			}

		    });

		const index = numeroMaximum + 1;

		const ligne = document.createElement("div");

		ligne.className = "transport-public-ligne";

		ligne.innerHTML = `
		    <div>
			<label for="typeTransportPublic${index}">
			    Type de transport
			</label>

			<select
			    id="typeTransportPublic_${index}"
			    name="typeTransportPublic_${index}"
			>
			    <option value="">Choisir un type de transport public</option>
			    <option value="Autobus">Autobus</option>
			    <option value="Avion">Avion</option>
			    <option value="Taxi">Taxi</option>
			    <option value="Train">Train</option>
			    <option value="Transport en commun municipal">Transport en commun municipal</option>
			    <option value="Traversier">Traversier</option>
			</select>
		    </div>

		    <div>
			<label for="montantTransportPublic_${index}">
			    Montant
			</label>

			<input
			    type="text"
			    inputmode="decimal"
			    id="montantTransportPublic_${index}"
			    name="montantTransportPublic_${index}"
			    placeholder="Inscrire le montant"
			>
		    </div>

		    <button
			type="button"
			class="bouton-supprimer-transport"
			aria-label="Supprimer ce transport"
			title="Supprimer ce transport"
		    >
			<span aria-hidden="true">🗑</span>
		    </button>
		`;

		conteneurTransportsPublics.appendChild(ligne);

		const champMontant =
		    ligne.querySelector(
			'input[id^="montantTransportPublic_"]'
		    );

		configurerChampMontant(champMontant);

	    }
	);

    }


    // --------------------------------------------
    // SUPPRIMER UNE LIGNE DE TRANSPORT
    // --------------------------------------------

    conteneurTransportsPublics.addEventListener(
	"click",
	function() {

	    const boutonSupprimer =
		event.target.closest(".bouton-supprimer-transport");

	    if (!boutonSupprimer) {
		return;
	    }

	    const ligne =
		boutonSupprimer.closest(".transport-public-ligne");

	    if (!ligne) {
		return;
	    }

	    const lignes =
		conteneurTransportsPublics.querySelectorAll(
		    ".transport-public-ligne"
		);


	   if (ligne === lignes[0]) {
		return;
	    }

	    ligne.remove();

	    calculerAutresTransports();
	    calculerTotalJournee();

	}
    );
}
	

/* ================================
   TOTAL AUTRES DÉPENSES
================================ */

function calculerAutresDepenses() {

    const stationnement =
	montantEnNombre(
            document.getElementById("stationnement")?.value
    	);

    const autresDepenses = 
	montantEnNombre(
            document.getElementById("autresDepenses")?.value
    	);


    const total =
        stationnement +
        autresDepenses;


    const affichage =
	document.getElementById("totalAutresDepenses");


    if (affichage) {
        affichage.textContent =
            afficherMontant(total);
    }
}

/* ================================
   ÉCOUTEURS AUTRES DÉPENSES
================================ */

document.getElementById("stationnement")
    ?.addEventListener(
	"input",
	function() {
	    calculerAutresDepenses();
	    calculerTotalJournee();
	}
    );

document.getElementById("autresDepenses")
    ?.addEventListener(
	"input",
	function() {
	    calculerAutresDepenses();
	    calculerTotalJournee();
	}
    );

 /* ================================
   TOTAL DU RAPPORT
================================ */

function calculerTotalJournee() {

    const remboursementKilometrage =
	montantEnNombre(
	    document.getElementById(
		"totalDeplacements"
	    )?.textContent || ""
	);

    const montantLocation =
	montantEnNombre(
	    document.getElementById(
		"totalLocation"
	    )?.textContent || ""
	);

    const montantTransportsPublics =
	montantEnNombre(
	    document.getElementById(
		"totalTransportsPublics"
	    )?.textContent || ""
	);

    const montantRepas =
	montantEnNombre(
	    document.getElementById(
		"totalRepas"
	    )?.textContent || ""
	);

    const montantAutresDepenses =
	montantEnNombre(
	    document.getElementById(
		"totalAutresDepenses"
	    )?.textContent || ""
	);

    const totalGeneral =
	remboursementKilometrage +
	montantLocation +
	montantTransportsPublics +
	montantRepas +
	montantAutresDepenses


    /* ================================
       TOTAUX DU RAPPORT
    ================================ */

    const totalRapportKilometrage =
        document.getElementById(
            "totalRapportKilometrage"
        );


    const totalRapportLocation =
        document.getElementById(
            "totalRapportLocation"
        );


    const totalRapportTransportsPublics =
        document.getElementById(
            "totalRapportTransportsPublics"
        );


    const totalRapportRepas =
        document.getElementById(
            "totalRapportRepas"
        );


    const totalRapportAutresDepenses =
        document.getElementById(
            "totalRapportAutresDepenses"
        );


    const totalRapportGeneral =
        document.getElementById(
            "totalRapportGeneral"
        );


    if (totalRapportKilometrage) {

        totalRapportKilometrage.textContent =
            afficherMontant(
                remboursementKilometrage
            );
    }


    if (totalRapportLocation) {

        totalRapportLocation.textContent =
            afficherMontant(
		montantLocation
            );
    }


    if (totalRapportTransportsPublics) {

        totalRapportTransportsPublics.textContent =
            afficherMontant(
		montantTransportsPublics
            );
    }


    if (totalRapportRepas) {

        totalRapportRepas.textContent =
            afficherMontant(
                montantRepas
            );
    }


    if (totalRapportAutresDepenses) {

        totalRapportAutresDepenses.textContent =
            afficherMontant(
                montantAutresDepenses
            );
    }


    if (totalRapportGeneral) {

        totalRapportGeneral.textContent =
            afficherMontant(
                totalGeneral
            );
    }


    /* ================================
       TOTAUX DE VÉRIFICATION — ÉTAPE 5
    ================================ */

    const verificationKilometrage =
        document.getElementById("verificationKilometrage");

    const verificationLocation =
        document.getElementById("verificationLocation");

    const verificationTransportsPublics =
        document.getElementById("verificationTransportsPublics");

    const verificationRepas =
        document.getElementById("verificationRepas");

    const verificationAutresDepenses =
        document.getElementById("verificationAutresDepenses");

    const verificationTotalGeneral =
        document.getElementById("verificationTotalGeneral");


    if (verificationKilometrage) {
        verificationKilometrage.textContent =
            afficherMontant(remboursementKilometrage);
    }

    if (verificationLocation) {
        verificationLocation.textContent =
            afficherMontant(montantLocation);
    }

    if (verificationTransportsPublics) {
        verificationTransportsPublics.textContent =
            afficherMontant(montantTransportsPublics);
    }

    if (verificationRepas) {
        verificationRepas.textContent =
            afficherMontant(montantRepas);
    }

    if (verificationAutresDepenses) {
        verificationAutresDepenses.textContent =
            afficherMontant(montantAutresDepenses);
    }

    if (verificationTotalGeneral) {
        verificationTotalGeneral.textContent =
            afficherMontant(totalGeneral);
    }
}


/* ================================
   SÉLECTEURS DE DATE
================================ */

flatpickr.l10ns.fr.firstDayOfWeek = 0;


flatpickr("#dateActivite", {

    locale: "fr",

    dateFormat: "Y-m-d",

    altInput: true,

    altFormat: "j F Y",

    allowInput: false,


    onReady: function(
        selectedDates,
        dateStr,
        instance
    ) {

        const bouton =
            document.createElement("button");


        bouton.type = "button";

        bouton.textContent = "Aujourd'hui";


        bouton.style.width = "100%";

        bouton.style.marginTop = "8px";

        bouton.style.padding = "8px";

        bouton.style.border = "1px solid #ccc";

        bouton.style.borderRadius = "4px";

        bouton.style.backgroundColor = "#f5f5f5";

        bouton.style.cursor = "pointer";


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
});

/* ================================
   DATE DE L'ACTIVITÉ
================================ */


document.getElementById("dateActivite")
    ?.addEventListener(
        "change",
        function() {

            const pieces =
                document.getElementById(
                    "piecesJustificatives"
                );

            if (pieces) {
                pieces.disabled = !this.value;
            }

            
		calculerKilometrage();
		afficherMontantsRepas();
        	verifierChampsObligatoires();

        }
    );


/* ================================
   HEURE DE DÉPART
================================ */

document.getElementById("heureDepart")
    .addEventListener(
        "change",
        function() {

	    verifierRepas();
	    calculerTotalRepas();
            verifierChampsObligatoires();

        }
    );


/* ================================
   HEURE DE RETOUR
================================ */

document.getElementById("heureRetour")
    .addEventListener(
        "change",
        function() {

	    verifierRepas();
	    calculerTotalRepas();
            verifierChampsObligatoires();

        }
    );

/* ================================
   ÉTAT INITIAL
================================ */

verifierChampsObligatoires();

document.getElementById("villeDepart")
    ?.addEventListener(
	"change", 
	function() {
	    calculerKilometrage();
	    calculerAutresTransports();
	    calculerTotalJournee();
	}
    );

document.getElementById("villeActivite")
    ?.addEventListener(
	"change",
	function() {
	    calculerKilometrage();
	    calculerAutresTransports();
	    calculerTotalJournee();
	}
    );

verifierRepas();

/* ================================
   PLACEHOLDER DES MENUS DE VILLES
================================ */

const menusVilles = [
    document.getElementById("villeDepart"),
    document.getElementById("villeActivite")
];

menusVilles.forEach(
    function(menu) {

        if (!menu) {
            return;
        }

        if (menu.value === "") {

            menu.classList.add(
                "placeholder-select"
            );

        }

        menu.addEventListener(
            "change",
            function() {

                if (menu.value === "") {

                    menu.classList.add(
                        "placeholder-select"
                    );

                } else {

                    menu.classList.remove(
                        "placeholder-select"
                    );

                }

            }
        );

    }
);


// ============================================================
// JUSTIFICATION DES AUTRES DÉPENSES
// ============================================================

const divers = document.getElementById("autresDepenses");
const justification = document.getElementById("justification");
const compteurJustification = document.getElementById("compteurJustification");

if (divers && justification) {

    const labelJustification =
        document.querySelector('label[for="justification"]');

    justification.addEventListener("input", function () {
        compteurJustification.textContent =
            justification.value.length + "  / 40 caractères";
    });

    function mettreAJourJustification() {

        const montant = montantEnNombre(divers.value);

        if (montant > 0) {

            justification.disabled = false;
            justification.required = true;
            justification.placeholder =
                "Préciser la nature de la dépense inscrite en 'Autres'";

            if (labelJustification) {
                labelJustification.style.color = "#354352";
                labelJustification.innerHTML =
                    'Justification <span class="obligatoire">*</span>';
            }

        } else {

            justification.disabled = true;
            justification.required = false;
            justification.value = "";
            justification.placeholder = "";

            if (labelJustification) {
                labelJustification.style.color = "#aaa";
                labelJustification.textContent = "Justification";
            }

            compteurJustification.textContent = " 0 / 40 caractères";
        }

        verifierChampsObligatoires();
    }

    divers.addEventListener("input", mettreAJourJustification);

    justification.addEventListener(
        "input",
        verifierChampsObligatoires
    );

    mettreAJourJustification();
}


/* ================================
   INITIALISATION DU FORMATAGE
================================ */

[
    "locationCout",
    "locationEssence",
    "stationnement",
    "autresDepenses",
    "montantTransportPublic_1"
].forEach(function(id) {

    configurerChampMontant(
	document.getElementById(id)
    );
});
