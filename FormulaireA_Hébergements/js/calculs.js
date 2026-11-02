// ============================================================
// CALCULS DU RAPPORT DE DÉPLACEMENTS
// ============================================================


// ============================================================
// FORMATAGE ET CONVERSIONS
// ============================================================

// ------------------------------------------------------------
// AFFICHER UN MONTANT
// ------------------------------------------------------------


function afficherMontant(montant) {

    return Number(montant).toLocaleString(
        "fr-CA",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " $";

}


// ------------------------------------------------------------
// FORMATER UN CHAMP DE MONTANT À LA SORTIE
// ------------------------------------------------------------

function configurerChampMontant(champ) {

    if (!champ || champ.dataset.formatMontant === "true") {
	return;
    }

    champ.dataset.formatMontant = "true";

    champ.addEventListener("focus", function() {

	this.value = this.value
	    .replace(/\s/g, "")
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

// ------------------------------------------------------------
// CONVERTIR UNE HEURE EN MINUTES
// ------------------------------------------------------------

function heureEnMinutes(heure) {

    if (!heure) {
        return null;
    }

    const parties = heure.split(":");

    return (
        Number(parties[0]) * 60 +
        Number(parties[1])
    );

}

// ------------------------------------------------------------
// CONVERTIR UN MONTANT AFFICHÉ EN NOMBRE
// ------------------------------------------------------------

function montantEnNombre(texte) {

    if (texte === null || texte === undefined) {
	return 0;
    }

    const valeur = String(texte)
        .replace(/[\s\u00A0\u202F]/g, "")
	.replace(/\$/g, "")
	.replace(",", ".");

    const montant = parseFloat(valeur);

    return Number.isFinite(montant) ? montant : 0;


}

// ============================================================
// CALCULS DES REPAS
// ============================================================

// ------------------------------------------------------------
// VÉRIFIER L'ADMISSIBILITÉ DES REPAS
// ------------------------------------------------------------

function verifierRepas(numero) {

    const heureDepart = 
	document.getElementById(
	    "heureDepart"
	).value;

    const heureRetour = 
	document.getElementById(
	    "heureRetour"
	).value;


    if (!heureDepart || !heureRetour) {
        return;
    }

    const dateDepart = 
	document.getElementById(
	    "dateDepart"
	).value;

    const dateRetour = 
	document.getElementById(
	    "dateRetour"
	).value;

    if (!dateDepart || !dateRetour) {
        return;
    }

    const debut = 
	new Date(
	    dateDepart + "T00:00:00"
	);

    const fin = 
	new Date(
	    dateRetour + "T00:00:00"
	);

    const nombreJournees =
        Math.round(
	    (fin - debut) / 
	    (1000 * 60 * 60 * 24)
	) + 1;

    // --------------------------------------------------------
    // DÉTERMINER LE TYPE DE JOURNÉE
    // --------------------------------------------------------

    const estPremiereJournee = 
	numero === 1;

    const estDerniereJournee = 
	numero === nombreJournees;

    const estJourneeUnique = 
	nombreJournees === 1;

    let dejeunerAdmissible = false;
    let dinerAdmissible = false;
    let souperAdmissible = false;
    let collationAdmissible = false;

    // --------------------------------------------------------
    // VOYAGE D'UNE SEULE JOURNÉE
    // --------------------------------------------------------

    if (estJourneeUnique) {
        const depart = 
	    heureEnMinutes(
		heureDepart
	    );

        const retour = 
	    heureEnMinutes(
		heureRetour
	    );

        dejeunerAdmissible =
            depart <=
		heureEnMinutes("07:30") &&
            retour >=
		heureEnMinutes("09:00");

        dinerAdmissible =
            depart <= 
		heureEnMinutes("12:00") &&
            retour >= 
		heureEnMinutes("12:30");

        souperAdmissible =
            depart <=
		heureEnMinutes("18:00") &&
            retour >=
		heureEnMinutes("18:30");

        collationAdmissible =
            depart <=
		heureEnMinutes("22:00") &&
            retour >=
		heureEnMinutes("22:00");
    }

    // --------------------------------------------------------
    // PREMIÈRE JOURNÉE
    // --------------------------------------------------------

    else if (estPremiereJournee) {

        const depart = 
	    heureEnMinutes(
		heureDepart
	    );

        dejeunerAdmissible =
            depart <= 
		heureEnMinutes("07:30");

        dinerAdmissible =
            depart <=
		heureEnMinutes("12:00");

        souperAdmissible =
            depart <=
		heureEnMinutes("18:00");

        collationAdmissible =
            depart <=
		heureEnMinutes("22:00");
    }

    // --------------------------------------------------------
    // JOURNÉE INTERMÉDIAIRE
    // --------------------------------------------------------

    else if (!estDerniereJournee) {

        dejeunerAdmissible = true;
        dinerAdmissible = true;
        souperAdmissible = true;
        collationAdmissible = true;
    }

    // --------------------------------------------------------
    // DERNIÈRE JOURNÉE
    // --------------------------------------------------------

    else {
        const retour = 
	    heureEnMinutes(
		heureRetour
	    );

        dejeunerAdmissible =
            retour >=
	    heureEnMinutes("09:00");

        dinerAdmissible =
            retour >=
	    heureEnMinutes("12:30");

        souperAdmissible =
            retour >=
	    heureEnMinutes("18:30");

        collationAdmissible =
            retour >=
	    heureEnMinutes("22:00");
    }

    // --------------------------------------------------------
    // APPLICATION AUX CASES
    // --------------------------------------------------------

    const dejeuner = 
	document.getElementById(
	    "dejeuner" + numero
	);

    const diner = 
	document.getElementById(
	    "diner" + numero
	);

    const souper = 
	document.getElementById(
	    "souper" + numero
	);

    const collation = 
	document.getElementById(
	    "collation" + numero
	);

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

    afficherMontantsRepas(numero);

    calculerTotalRepas(numero);
}

// ------------------------------------------------------------
// AFFICHER LES MONTANTS DES REPAS
// ------------------------------------------------------------

function afficherMontantsRepas(numero) {

    const parametres =
        obtenirParametresPourJournee(
	    numero
	);

    if (!parametres) {
        return;
    }


    const dejeuner =
        document.getElementById(
            "dejeuner" + numero
        );

    const diner =
        document.getElementById(
            "diner" + numero
        );

    const souper =
        document.getElementById(
            "souper" + numero
        );

    const collation =
        document.getElementById(
            "collation" + numero
        );


    const montantDejeuner =
        document.getElementById(
            "montantDejeuner" + numero
        );

    const montantDiner =
        document.getElementById(
            "montantDiner" + numero
        );

    const montantSouper =
        document.getElementById(
            "montantSouper" + numero
        );

    const montantCollation =
        document.getElementById(
            "montantCollation" + numero
        );


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

// ------------------------------------------------------------
// CALCULER LE TOTAL DES REPAS
// ------------------------------------------------------------

function calculerTotalRepas(numero) {

    const parametres =
        obtenirParametresPourJournee(
	    numero
	);

    if (!parametres) {
        return;
    }

    const dejeuner =
        document.getElementById(
            "dejeuner" + numero
        )?.checked || false;

    const diner =
        document.getElementById(
            "diner" + numero
        )?.checked || false;

    const souper =
        document.getElementById(
            "souper" + numero
        )?.checked || false;

    const collation =
        document.getElementById(
            "collation" + numero
        )?.checked || false;

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
        document.getElementById(
            "totalRepas" + numero
        );

    if (affichage) {
        affichage.textContent =
            afficherMontant(total);
    }
}


// ============================================================
// CALCULS DES DÉPENSES PAR JOURNÉE
// ============================================================

// ------------------------------------------------------------
// TOTAL DU KILOMÉTRAGE
// ------------------------------------------------------------

function calculerKilometrage(numero) {

    const parametres =
        obtenirParametresPourJournee(
	    numero
	);

    if (!parametres) {
        return;
    }

    const tauxKilometrage =
        parametres.tauxKilometrage;

    const transit =
        parseFloat(
            document.getElementById(
                "deplacementTransit" + numero
            )?.value
        ) || 0;

    const locaux =
        parseFloat(
            document.getElementById(
                "deplacementsLocaux" + numero
            )?.value
        ) || 0;

    const totalKm =
        transit + 
	locaux;

    const montant =
        totalKm * 
	tauxKilometrage;

    const affichage =
        document.getElementById(
            "totalKilometrage" + numero
        );

    if (affichage) {
        affichage.textContent =
            afficherMontant(
	    	montant
	    );
    }
}


// ------------------------------------------------------------
// TOTAL DES AUTRES TRANSPORTS
// ------------------------------------------------------------

function calculerAutresTransports(numero) {


    // --------------------------------------------------------
    // LOCATION AUTOMOBILE
    // --------------------------------------------------------

    const locationCout =
        montantEnNombre(
            document.getElementById(
                "locationCout" + numero
            )?.value
        );

    const locationEssence =
        montantEnNombre(
            document.getElementById(
                "locationEssence" + numero
            )?.value
        );

    const totalLocation =
	locationCout + locationEssence;

    const affichageLocation =
	document.getElementById(
	    "totalLocation" + numero
	);

    if (affichageLocation) {
	affichageLocation.textContent =
	    afficherMontant(totalLocation);
    }


    // --------------------------------------------------------
    // TRANSPORTS PUBLICS, Y COMPRIS LES TAXIS
    // --------------------------------------------------------

    let totalTransportsPublics = 0;

    document.querySelectorAll(
	"#conteneurTransportsPublics" + numero +
	" input[id^='montantTransportPublic']"
    ).forEach(function(champ) {

	totalTransportsPublics +=
	    montantEnNombre(champ.value);

    });

    const affichageTransportsPublics =
	document.getElementById(
	    "totalTransportsPublics" + numero
	);

    if (affichageTransportsPublics) {
	affichageTransportsPublics.textContent =
	    afficherMontant(totalTransportsPublics);
    }
}


// ------------------------------------------------------------
// TOTAL DE L'HÉBERGEMENT
// ------------------------------------------------------------

function calculerHebergement(numero) {

    const parametres =
        obtenirParametresPourJournee(
	    numero
	);

    if (!parametres) {
        return;
    }

    const hotel =
        montantEnNombre(
            document.getElementById(
                "hotel" + numero
            )?.value
        );

    const hotelChoix =
        document.getElementById(
            "hotelChoix" + numero
        )?.checked || false;

    const proches =
        document.getElementById(
            "proches" + numero
        )?.checked || false;

    let total = 0;

    if (hotelChoix) {
        total = hotel;
    } else if (proches) {
        total = parametres.proches;
    }

    const affichage =
        document.getElementById(
            "totalHebergement" + numero
        );

    if (affichage) {
        affichage.textContent =
            afficherMontant(
		total
	    );
    }
}


// ------------------------------------------------------------
// TOTAL DES AUTRES DÉPENSES
// ------------------------------------------------------------

function calculerAutresDepenses(numero) {

    const stationnement =
        montantEnNombre(
            document.getElementById(
                "stationnement" + numero
            )?.value
        );

    const divers =
        montantEnNombre(
            document.getElementById(
                "divers" + numero
            )?.value
        );

    const total =
        stationnement +
        divers;

    const affichage =
        document.getElementById(
            "totalAutresDepenses" + numero
        );

    if (affichage) {
        affichage.textContent =
            afficherMontant(
		total
	    );
    }
}


// ============================================================
// TOTAUX
// ============================================================

// ------------------------------------------------------------
// TOTAL DE LA JOURNÉE
// ------------------------------------------------------------

function calculerTotalJournee(numero) {

    calculerKilometrage(numero);
    calculerAutresTransports(numero);
    calculerTotalRepas(numero);
    calculerHebergement(numero);
    calculerAutresDepenses(numero);

    const kilometrage =
        montantEnNombre(
            document.getElementById(
                "totalKilometrage" + numero
            )?.textContent || ""
        );

    const location =
        montantEnNombre(
            document.getElementById(
                "totalLocation" + numero
            )?.textContent || ""
        );

    const transportsPublics =
        montantEnNombre(
            document.getElementById(
                "totalTransportsPublics" + numero
            )?.textContent || ""
        );

    const repas =
        montantEnNombre(
            document.getElementById(
                "totalRepas" + numero
            )?.textContent || ""
        );

    const hebergement =
        montantEnNombre(
            document.getElementById(
                "totalHebergement" + numero
            )?.textContent || ""
        );

    const autresDepenses =
        montantEnNombre(
            document.getElementById(
                "totalAutresDepenses" + numero
            )?.textContent || ""
        );

    const total =
        kilometrage +
        location +
	transportsPublics +
        repas +
        hebergement +
        autresDepenses;

    const recapKilometrage =
        document.getElementById(
            "recapKilometrage" + numero
        );

    const recapLocation =
        document.getElementById(
            "recapLocation" + numero
        );

    const recapTransportsPublics =
        document.getElementById(
            "recapTransportsPublics" + numero
        );

    const recapRepas =
        document.getElementById(
            "recapRepas" + numero
        );

    const recapHebergement =
        document.getElementById(
            "recapHebergement" + numero
        );

    const recapAutresDepenses =
        document.getElementById(
            "recapAutresDepenses" + numero
        );

    const recapTotalJournee =
        document.getElementById(
            "recapTotalJournee" + numero
        );

    if (recapKilometrage) {
        recapKilometrage.textContent =
            afficherMontant(
		kilometrage
	    );
    }

    if (recapLocation) {
        recapLocation.textContent =
            afficherMontant(
		location
	    );
    }

    if (recapTransportsPublics) {
        recapTransportsPublics.textContent =
            afficherMontant(
		transportsPublics
	    );
    }

    if (recapRepas) {
        recapRepas.textContent =
            afficherMontant(
		repas
	    );
    }

    if (recapHebergement) {
        recapHebergement.textContent =
            afficherMontant(
		hebergement
	    );
    }

    if (recapAutresDepenses) {
        recapAutresDepenses.textContent =
            afficherMontant(
		autresDepenses
	    );
    }

    if (recapTotalJournee) {
        recapTotalJournee.textContent =
            afficherMontant(
		total
	    );
    }

    mettreAJourResumeJournee(numero);

    calculerTotalRapport();
}


// ------------------------------------------------------------
// TOTAL DU RAPPORT
// ------------------------------------------------------------

function calculerTotalRapport() {

    let totalKilometrage = 0;
    let totalLocation = 0;
    let totalTransportsPublics = 0;
    let totalRepas = 0;
    let totalHebergement = 0;
    let totalAutresDepenses = 0;

    for (
        let i = 1;
        i <= numeroJournee;
        i++
    ) {

        totalKilometrage +=
            montantEnNombre(
                document.getElementById(
                    "totalKilometrage" + i
                )?.textContent || ""
            );

        totalLocation +=
            montantEnNombre(
                document.getElementById(
                    "totalLocation" + i
                )?.textContent || ""
            );

        totalTransportsPublics +=
            montantEnNombre(
                document.getElementById(
                    "totalTransportsPublics" + i
                )?.textContent || ""
            );

        totalRepas +=
            montantEnNombre(
                document.getElementById(
                    "totalRepas" + i
                )?.textContent || ""
            );

        totalHebergement +=
            montantEnNombre(
                document.getElementById(
                    "totalHebergement" + i
                )?.textContent || ""
            );

        totalAutresDepenses +=
            montantEnNombre(
                document.getElementById(
                    "totalAutresDepenses" + i
                )?.textContent || ""
            );
    }

    const totalGeneral =
        totalKilometrage +
        totalLocation +
	totalTransportsPublics +
        totalRepas +
        totalHebergement +
        totalAutresDepenses;

    document.getElementById(
        "totalRapportKilometrage"
    ).textContent =
        afficherMontant(
	    totalKilometrage
	);

    document.getElementById(
        "totalRapportLocation"
    ).textContent =
        afficherMontant(
	    totalLocation
	);

    document.getElementById(
        "totalRapportTransportsPublics"
    ).textContent =
        afficherMontant(
	    totalTransportsPublics
	);

    document.getElementById(
        "totalRapportRepas"
    ).textContent =
        afficherMontant(
	    totalRepas
	);

    document.getElementById(
        "totalRapportHebergement"
    ).textContent =
        afficherMontant(
	    totalHebergement
	);

    document.getElementById(
        "totalRapportAutresDepenses"
    ).textContent =
        afficherMontant(
	    totalAutresDepenses
	);

    document.getElementById(
        "totalRapportGeneral"
    ).textContent =
        afficherMontant(
	    totalGeneral
	);

    mettreAJourResumeJourneesRapport();
}

// ============================================================
// RÉSUMÉS
// ============================================================

// ------------------------------------------------------------
// METTRE À JOUR LE RÉSUMÉ D'UNE JOURNÉE
// ------------------------------------------------------------

function mettreAJourResumeJournee(numero) {

    const resume =
        document.querySelector(
            '#conteneurJournees section[data-journee="' +
            numero +
            '"] .resume-journee'
        );

    if (!resume) {
        const sections =
            document.querySelectorAll(
                "#conteneurJournees section"
            );

        const section =
            sections[numero - 1];

        if (!section) {
            return;
        }

        const resumeSection =
            section.querySelector(
                ".resume-journee"
            );

        if (!resumeSection) {
            return;
        }

        mettreTexteResume(
            resumeSection,
            numero
        );

        return;
    }

    mettreTexteResume(
        resume,
        numero
    );
}

// ------------------------------------------------------------
// CONSTRUIRE LE TEXTE DU RÉSUMÉ D'UNE JOURNÉE
// ------------------------------------------------------------

function mettreTexteResume(
    resume, 
    numero
) {

    const total =
        montantEnNombre(
            document.getElementById(
                "totalKilometrage" + numero
            )?.textContent || ""
	) +

        montantEnNombre(
            document.getElementById(
                "totalLocation" + numero
            )?.textContent || ""
	) +

        montantEnNombre(
            document.getElementById(
                "totalTransportsPublics" + numero
            )?.textContent || ""
	) +

        montantEnNombre(
            document.getElementById(
                "totalRepas" + numero
            )?.textContent || ""
	) +

        montantEnNombre(
            document.getElementById(
                "totalHebergement" + numero
            )?.textContent || ""
	) +

        montantEnNombre(
            document.getElementById(
                "totalAutresDepenses" + numero
            )?.textContent || ""
        );


    const kilometrage =
        parseFloat(
            document.getElementById(
                "deplacementTransit" + numero
            )?.value
        ) || 0;

    const kilometrageLocal =
        parseFloat(
            document.getElementById(
                "deplacementsLocaux" + numero
            )?.value
        ) || 0;

    const totalKm =
        kilometrage +
        kilometrageLocal;

    const nombreRepas =
        [
            "dejeuner",
            "diner",
            "souper",
            "collation"
        ]
        .filter(
	    function(repas) {

                return document.getElementById(
                    repas + numero
                )?.checked;

            }
	)
        .length;

    const location =
        montantEnNombre(
            document.getElementById(
                "totalLocation" + numero
            )?.textContent || ""
        );

    const transportsPublics =
        montantEnNombre(
            document.getElementById(
                "totalTransportsPublics" + numero
            )?.textContent || ""
        );

    const hebergement =
        montantEnNombre(
            document.getElementById(
                "totalHebergement" + numero
            )?.textContent || ""
        );

    const autres =
        montantEnNombre(
            document.getElementById(
                "totalAutresDepenses" + numero
            )?.textContent || ""
        );

    const elements = [];

    elements.push(
        "Total : " +
        afficherMontant(
	    total
	)
    );

    if (totalKm > 0) {

        elements.push(
            totalKm +
            " km"
        );

    }

    if (location > 0) {
	elements.push(
	    "Location : " + afficherMontant(location)
	);
    }

    if (transportsPublics > 0) {
	elements.push(
	    "Transports publics : " + afficherMontant(transportsPublics)
	);
    }

    if (nombreRepas > 0) {

        elements.push(
            nombreRepas +
	    " repas"
        );

    }

    if (hebergement > 0) {

        elements.push(
            "Hébergement : " +
            afficherMontant(
		hebergement
	    )
        );

    }

    if (autres > 0) {

        elements.push(
            "Autres : " +
            afficherMontant(
		autres
	    )
        );

    }

    resume.textContent =
        elements.join(" · ");
}

// ------------------------------------------------------------
// METTRE À JOUR LE RÉSUMÉ DES JOURNÉES — ÉCRAN 3
// ------------------------------------------------------------

function mettreAJourResumeJourneesRapport() {

    const conteneur =
        document.getElementById(
            "conteneurResumeJournees"
        );

    if (!conteneur) {
        return;
    }

    conteneur.innerHTML = "";

    const sections =
        document.querySelectorAll(
            "#conteneurJournees section"
        );

    sections.forEach(
        function(section, index) {

            const numero =
                index + 1;

            const kilometrage =
                montantEnNombre(
                    document.getElementById(
                        "totalKilometrage" + numero
                    )?.textContent || ""
                );

            const location =
                montantEnNombre(
                    document.getElementById(
                        "totalLocation" + numero
                    )?.textContent || ""
                );

            const transportsPublics =
                montantEnNombre(
                    document.getElementById(
                        "totalTransportsPublics" + numero
                    )?.textContent || ""
                );

            const repas =
                montantEnNombre(
                    document.getElementById(
                        "totalRepas" + numero
                    )?.textContent || ""
                );

            const hebergement =
                montantEnNombre(
                    document.getElementById(
                        "totalHebergement" + numero
                    )?.textContent || ""
                );

            const autresDepenses =
                montantEnNombre(
                    document.getElementById(
                        "totalAutresDepenses" + numero
                    )?.textContent || ""
                );

            const total =
                kilometrage +
                location +
		transportsPublics +
                repas +
                hebergement +
                autresDepenses;

            const entete =
                section.querySelector(
                    ".entete-journee"
                );

            const titre =
                entete?.querySelector(
                    ".titre-journee"
                )?.textContent ||
                "Jour " + numero;

            const bloc =
                document.createElement(
		    "div"
		);

            bloc.className =
                "resume-journee-rapport";

            const titreJournee =
                document.createElement(
		    "h4"
		);

            titreJournee.textContent =
                titre;

            bloc.appendChild(
                titreJournee
            );

            const categories = [];

            if (kilometrage > 0) {
                categories.push(
                    "Kilométrage : " +
                    afficherMontant(
			kilometrage
		    )
                );
            }

            if (location > 0) {
                categories.push(
                    "Location : " +
                    afficherMontant(
			location
		    )
                );
            }

            if (transportsPublics > 0) {
                categories.push(
                    "Transports publics : " +
                    afficherMontant(
			transportsPublics
		    )
                );
            }

            if (repas > 0) {
                categories.push(
                    "Repas : " +
                    afficherMontant(
			repas
		    )
                );
            }

            if (hebergement > 0) {
                categories.push(
                    "Hébergement : " +
                    afficherMontant(
			hebergement
		    )
                );
            }

            if (autresDepenses > 0) {
                categories.push(
                    "Autres dépenses : " +
                    afficherMontant(
			autresDepenses
		    )
                );
            }

            categories.forEach(
                function(texte) {

                    const ligne =
                        document.createElement(
			    "div"
			);

                    ligne.textContent =
                        texte;

                    bloc.appendChild(
                        ligne
                    );
                }
            );

            const totalJournee =
                document.createElement(
		    "strong"
		);

            totalJournee.textContent =
                "Total : " +
                afficherMontant(
		    total
		);

            bloc.appendChild(
                totalJournee
            );

            conteneur.appendChild(
                bloc
            );
        }
    );

    const affichageNombre =
        document.getElementById(
            "nombreJourneesRapport"
        );

    if (affichageNombre) {
        affichageNombre.textContent =
            sections.length;
    }
}