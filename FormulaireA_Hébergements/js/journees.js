// ============================================================
// GESTION DES JOURNÉES
// ============================================================

let numeroJournee = 1;


// ============================================================
// CONFIGURATION D'UNE JOURNÉE
// ============================================================

function configurerJournee(numero) {

    [
	"locationCout",
	"locationEssence",
	"hotel",
	"stationnement",
	"divers"
    ].forEach(function(prefixe) {

	configurerChampMontant(
	    document.getElementById(prefixe + numero)
	);
    });

    document.querySelectorAll(
	"#conteneurTransportsPublics" + numero +
	" input[id^='montantTransportPublic']"
    ).forEach(function(champ) {

	configurerChampMontant(champ);

    });

    afficherMontantsRepas(numero);
    verifierRepas(numero);
    calculerTotalJournee(numero);

    // --------------------------------------------------------
    // CHAMPS QUI DÉCLENCHENT UN RECALCUL
    // --------------------------------------------------------


    const champsCalcul = [
        "deplacementTransit",
        "deplacementsLocaux",
        "locationCout",
        "locationEssence",
        "hotel",
        "stationnement",
        "divers"
    ];


    champsCalcul.forEach(
	function(champ) {

            const element =
            	document.getElementById(
                    champ + numero
            	);


            if (element) {

            	element.addEventListener(
                    "input",
                    function() {

                    	calculerTotalJournee(numero);

                    }
            	);

            }

    	}

    );


    // --------------------------------------------------------
    // TRANSPORT PUBLIC — AJOUT DE LIGNES ET CALCULS
    // --------------------------------------------------------

    const conteneurTransports =
	document.getElementById(
	    "conteneurTransportsPublics" + numero
	);

    const boutonAjouterTransport =
	document.querySelector(
	    '.bouton-ajouter-transport[data-journee="' +
	    numero +
	    '"]'
	);


    if (conteneurTransports) {

	conteneurTransports.addEventListener(
	    "input",
	    function(e) {

	        if (
		    e.target.matches(
		        "input[id^='montantTransportPublic']"
		    )
	        ) {
		    calculerTotalJournee(numero);
	        }
	    }
        );
    }

    if(boutonAjouterTransport && conteneurTransports) {

        // --------------------------------------------------------
        // AJOUTER UNE LIGNE DE TRANSPORT
        // --------------------------------------------------------

	boutonAjouterTransport.addEventListener(
	    "click",
	    function() {

		let numeroMaximum = 0;

		conteneurTransports
		    .querySelectorAll(".transport-public-ligne")
		    .forEach(function(ligneExistante) {

			const champMontant =
			    ligneExistante.querySelector(
				"input[id^='montantTransportPublic']"
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

		const ligne =
		    document.createElement("div");

		ligne.className =
		    "transport-public-ligne";

		ligne.innerHTML = `
		    <div>
			<label for="typeTransportPublic${numero}_${index}">
			    Type de transport
			</label>

			<select
			    id="typeTransportPublic${numero}_${index}"
			    name="typeTransportPublic${numero}_${index}"
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
			<label for="montantTransportPublic${numero}_${index}">
			    Montant
			</label>

			<input
			    type="text"
			    inputmode="decimal"
			    id="montantTransportPublic${numero}_${index}"
			    name="montantTransportPublic${numero}_${index}"
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

		conteneurTransports.appendChild(ligne);

		const champMontant = ligne.querySelector(
		    "input[id^='montantTransportPublic']"
		);

		configurerChampMontant(champMontant);

	    }
	);
    }


    // ------------------------------------------------------------
    // SUPPRIMER UNE LIGNE DE TRANSPORT
    // ------------------------------------------------------------

    if (conteneurTransports) {

	conteneurTransports.addEventListener(
	    "click",
	    function(e) {

		const boutonSupprimer =
		    e.target.closest(
			".bouton-supprimer-transport"
 		    );

		if (!boutonSupprimer) {
		    return;
		}

		const ligne =
		    boutonSupprimer.closest(
			".transport-public-ligne"
		    );

		if (!ligne) {
		    return;
		}

		const lignes =
		    conteneurTransports.querySelectorAll(
			".transport-public-ligne"
		    );

		if (ligne === lignes[0]) {
		    return;
		}

		ligne.remove();

		calculerTotalJournee(numero);

	    }
	);

    }


    // --------------------------------------------------------
    // LOCATION — ESSENCE
    // --------------------------------------------------------

    const locationCout =
	document.getElementById(
	    "locationCout" + numero
	);

    const locationEssence =
	document.getElementById(
	    "locationEssence" + numero
	);

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

	    calculerTotalJournee(numero);

	}

	locationCout.addEventListener(
	    "input",
	    mettreAJourLocationEssence
	);

	mettreAJourLocationEssence();

    }

    // --------------------------------------------------------
    // CASES DE REPAS
    // --------------------------------------------------------


    const casesRepas = [
        "dejeuner",
        "diner",
        "souper",
        "collation"
    ];


    casesRepas.forEach(
	function(repas) {

            const element =
                document.getElementById(
                    repas + numero
                );


            if (element) {

                element.addEventListener(
                    "change",
                    function() {

                        calculerTotalJournee(numero);

                    }
                );

            }

        }
    );

    // --------------------------------------------------------
    // HÉBERGEMENT
    // --------------------------------------------------------


    const proches =
        document.getElementById(
            "proches" + numero
        );


    const hotelChoix =
        document.getElementById(
            "hotelChoix" + numero
        );


    const hotel =
        document.getElementById(
            "hotel" + numero
        );


    if (hotelChoix) {

        hotelChoix.addEventListener(
            "change",
            function() {

                if (hotelChoix.checked) {

                    proches.checked = false;

                    hotel.disabled = false;


                    const montantProches =
                        document.querySelector(
                            "#proches" + numero
                        )
                        .closest("div")
                        .querySelector(
                            ".montant-proches"
                        );


                    montantProches.style.color =
                        "#aaa";

                } else {

                    hotel.disabled = true;

                    hotel.value = "";

                }


                calculerTotalJournee(numero);

            }
        );

    }


    if (proches) {

        proches.addEventListener(
            "change",
            function() {

                const montantProches =
                    document.querySelector(
                        "#proches" + numero
                    )
                    .closest("div")
                    .querySelector(
                        ".montant-proches"
                    );


                if (proches.checked) {

                    hotelChoix.checked = false;

                    hotel.disabled = true;

                    hotel.value = "";

                    montantProches.style.color =
                        "#354352";

                } else {

                    montantProches.style.color =
                        "#aaa";

                }


                calculerTotalJournee(numero);

            }
        );

    }


    // --------------------------------------------------------
    // JUSTIFICATION DES AUTRES DÉPENSES
    // --------------------------------------------------------


    const divers =
        document.getElementById(
            "divers" + numero
        );


    const justification =
        document.getElementById(
            "justification" + numero
        );

    const compteurJustification =
	document.getElementById(
	    "compteurJustification" + numero
	);

    if (
	justification &&
	compteurJustification
    ) {

	justification.addEventListener(
	    "input",
	    function() {

		compteurJustification.textContent =
		    justification.value.length + "  / 55 caractères";
	    }
	);

    }


    if (
	divers && 
	justification
    ) {

        const labelJustification =
            document.querySelector(
                'label[for="justification' +
                numero +
                '"]'
            );


        function mettreAJourJustification() {

            const montant =
                montantEnNombre(
                    divers.value
                );


            if (montant > 0) {

                justification.disabled =
                    false;

                justification.required =
                    true;

                justification.placeholder =
                    "Préciser la nature de la dépense inscrite en 'Autres'";


                if (labelJustification) {

                    labelJustification.style.color =
                        "#354352";

                    labelJustification.innerHTML =
                        'Justification <span class="obligatoire">*</span>';

                }

            } else {

                justification.disabled =
                    true;

                justification.required =
                    false;

                justification.value =
                    "";

                justification.placeholder =
                    "";


                if (labelJustification) {

                    labelJustification.style.color =
                        "#aaa";

                    labelJustification.textContent =
                        "Justification";

                }

            }


            verifierChampsObligatoires();

        }


        divers.addEventListener(
            "input",
            mettreAJourJustification
        );


        justification.addEventListener(
            "input",
            verifierChampsObligatoires
        );


        mettreAJourJustification();

    }

}


// ============================================================
// CRÉATION AUTOMATIQUE DES JOURNÉES
// ============================================================

function creerJournees() {

    const dateDepart =
        document.getElementById(
            "dateDepart"
        ).value;


    const dateRetour =
        document.getElementById(
            "dateRetour"
        ).value;


    const conteneur =
        document.getElementById(
            "conteneurJournees"
        );


    // --------------------------------------------------------
    // AUCUNE DATE DE DÉPART
    // --------------------------------------------------------


    if (!dateDepart) {

        conteneur.innerHTML =
            "";

        numeroJournee =
            0;

        return;

    }


    // --------------------------------------------------------
    // DÉTERMINER LES DATES
    // --------------------------------------------------------


    const debut =
        new Date(
            dateDepart +
            "T00:00:00"
        );


    let fin;


    if (dateRetour) {

        fin =
            new Date(
                dateRetour +
                "T00:00:00"
            );


        if (fin < debut) {

            conteneur.innerHTML =
                "";

            numeroJournee =
                0;

            return;

        }

    } else {

        fin =
            debut;

    }


    // --------------------------------------------------------
    // CALCULER LE NOMBRE DE JOURNÉES
    // --------------------------------------------------------


    const nombreJournees =
        Math.round(
            (
                fin -
                debut
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        ) + 1;


    conteneur.innerHTML =
        "";

    numeroJournee =
        nombreJournees;

    // --------------------------------------------------------
    // CRÉER CHAQUE JOURNÉE
    // --------------------------------------------------------


    for (
        let i = 0;
        i < nombreJournees;
        i++
    ) {

        const dateJournee =
            new Date(
                debut
            );


        dateJournee.setDate(
            debut.getDate() +
            i
        );


        const anneeJournee =
            String(
                dateJournee.getFullYear()
            );


        const parametresJournee =
            donneesParametres[
                anneeJournee
            ];


        // ----------------------------------------------------
        // VÉRIFIER LES PARAMÈTRES DE L'ANNÉE
        // ----------------------------------------------------


        if (!parametresJournee) {

            console.error(
                "Les paramètres pour l'année " +
                anneeJournee +
                " sont introuvables."
            );


            alert(
                "Les paramètres pour l'année " +
                anneeJournee +
                " sont introuvables."
            );


            return;

        }


        // ----------------------------------------------------
        // FORMATER LA DATE
        // ----------------------------------------------------


        const dateFormatee =
            dateJournee.getFullYear() +
            "-" +
            String(
                dateJournee.getMonth() + 1
            ).padStart(
                2,
                "0"
            ) +
            "-" +
            String(
                dateJournee.getDate()
            ).padStart(
                2,
                "0"
            );


        const dateAffichee =
            dateJournee.toLocaleDateString(
                "fr-CA",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        // ----------------------------------------------------
        // CRÉER LA SECTION DE LA JOURNÉE
        // ----------------------------------------------------

        const section =
            document.createElement(
                "section"
            );


        section.innerHTML = `

            <h2
		class="entete-journee"
		role="button"
		tabindex="0"
		data-journee="${i + 1}"
            >

		<span class="icone-journee">▼</span>

		<span class="titre-journee">
		    Jour ${i + 1} — ${dateAffichee}
		</span>

		<span class="resume-journee">
		    Total : 0,00 $
		</span>

		<span class="indication-accordeon">
		    Cliquer pour afficher
		</span>


    	    </h2>

    	    <div class="contenu-journee">

            <h3>Transports</h3>

            <div class="sous-section">

                <h4>Déplacements</h4>

                <div>
                    <label for="villeDepart${i + 1}">
                        Ville de départ
                    </label>

                    <input
                        type="text"
                        id="villeDepart${i + 1}"
                        name="villeDepart${i + 1}"
                        placeholder="Inscrire la ville de départ"
                    >
                </div>

                <div>
                    <label for="villeArrivee${i + 1}">
                        Ville d'arrivée
                    </label>

                    <input
                        type="text"
                        id="villeArrivee${i + 1}"
                        name="villeArrivee${i + 1}"
                        placeholder="Inscrire la ville d'arrivée"
                    >
                </div>

                <div>
                    <label for="deplacementTransit${i + 1}">
                        Déplacement (transit)
                    </label>

                    <input
                        type="number"
                        id="deplacementTransit${i + 1}"
                        name="deplacementTransit${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le nombre de kilomètres"
                    >
                </div>

                <div>
                    <label for="deplacementsLocaux${i + 1}">
                        Déplacements locaux
                    </label>

                    <input
                        type="number"
                        id="deplacementsLocaux${i + 1}"
                        name="deplacementsLocaux${i + 1}"
                        min="0"
                        step="0.01"
                        placeholder="Inscrire le nombre de kilomètres"
                    >
                </div>

		<div>
		    <label for="tauxKilometrique${i + 1}">
			Taux kilométrique
		    </label>

		    <span
			id="tauxKilometrique${i + 1}"
			class="valeur-calculee"
		    >
			0,00 $ / km
		    </span>
		</div>

                <div class="total-sous-section">

                    <strong>Total kilométrage :</strong>

                    <span id="totalKilometrage${i + 1}">
                        0,00 $
                    </span>

                </div>

            </div>

            <div class="sous-section">

                <h4>Location automobile</h4>

                <div>
                    <label for="locationCout${i + 1}">
                        Location — coût
                    </label>

                    <input
                        type="text"
			inputmode="decimal"
                        id="locationCout${i + 1}"
                        name="locationCout${i + 1}"
                        placeholder="Inscrire le montant"
                    >
                </div>

                <div>
                    <label for="locationEssence${i + 1}">
                        Location — essence
                    </label>

                    <input
                        type="text"
			inputmode="decimal"
                        id="locationEssence${i + 1}"
                        name="locationEssence${i + 1}"
                        placeholder="Inscrire le montant"
			disabled
                    >
                </div>

	        <div class="total-sous-section">
		    <strong>Total location :</strong>

		    <span id="totalLocation${i + 1}">
		        0,00 $
		    </span>
	        </div>

	    </div>

	    <div class="sous-section">

                <h4>
		    Transports publics

		    <span class="info-repas">
			ⓘ

			<span class="info-bulle-repas">
			    <strong>Transports publics</strong><br><br>
			
			Choisir dans la liste déroulante tout type de transport public utilisé durant la journée. Vous
			pouvez en ajouter autant que nécessaire.


		 	</span>
		    </span>
		</h4>

		<div
		    id="conteneurTransportsPublics${i + 1}"
		    class="conteneur-transports-publics"
		>

		    <div class="transport-public-ligne">

			<div>
                    	    <label for="typeTransportPublic${i + 1}_1">
                        	Type de transport
                    	    </label>

			    <select
				id="typeTransportPublic${i + 1}_1"
				name="typeTransportPublic${i + 1}_1"
			    >
				<option value="" disabled selected>Choisir un type de transport public</option>
				<option value="Autobus">Autobus</option>
				<option value="Avion">Avion</option>
				<option value="Taxi">Taxi</option>
				<option value="Train">Train</option>
				<option value="Transport en commun municipal">Transport en commun municipal</option>
				<option value="Traversier">Traversier</option>
			    </select>
			</div>

			<div>
			    <label for="montantTransportPublic${i + 1}_1">
				Montant
			    </label>

                    	    <input
                        	type="text"
				inputmode="decimal"
                        	id="montantTransportPublic${i + 1}_1"
                        	name="montantTransportPublic${i + 1}_1"
                        	placeholder="Inscrire le montant"
                    	    >
                	</div>
		    </div>
		</div>

		<button
		    type="button"
		    class="bouton-ajouter-transport"
		    data-journee="${i + 1}"
		>
		    + Ajouter un transport
		</button>

                <div class="total-sous-section">

                    <strong>Total transports publics :</strong>

                    <span id="totalTransportsPublics${i + 1}">
                        0,00 $
                    </span>

                </div>

            </div>

            <h3>Frais de séjour</h3>

            <div class="sous-section">

                <h4>
		    Repas

		    <span class="info-repas">
			ⓘ

			<span class="info-bulle-repas">
			    <strong>Admissibilité des repas</strong><br><br>

            		    Déjeuner : départ au plus tard à 7 h 30 et retour après 9 h.<br><br>
            		    Dîner : départ au plus tard à 12 h et retour après 12 h 30.<br><br>
            		    Souper : départ au plus tard à 18 h et retour après 18 h 30.<br><br>
            		    Collation : départ au plus tard à 22 h et retour après 22 h.
		 	</span>
		    </span>
		</h4>

                <div class="repas-options">

                    <div>
                        <label for="dejeuner${i + 1}">
                            Déjeuner
                        </label>

                        <span id="montantDejeuner${i + 1}"></span>

                        <input
                            type="checkbox"
                            id="dejeuner${i + 1}"
                            name="dejeuner${i + 1}"
                            disabled
                        >
                    </div>

                    <div>
                        <label for="diner${i + 1}">
                            Dîner
                        </label>

                        <span id="montantDiner${i + 1}"></span>

                        <input
                            type="checkbox"
                            id="diner${i + 1}"
                            name="diner${i + 1}"
                            disabled
                        >
                    </div>

                    <div>
                        <label for="souper${i + 1}">
                            Souper
                        </label>

                        <span id="montantSouper${i + 1}"></span>

                        <input
                            type="checkbox"
                            id="souper${i + 1}"
                            name="souper${i + 1}"
                            disabled
                        >
                    </div>

                    <div>
                        <label for="collation${i + 1}">
                            Collation
                        </label>

                        <span id="montantCollation${i + 1}"></span>

                        <input
                            type="checkbox"
                            id="collation${i + 1}"
                            name="collation${i + 1}"
                            disabled
                        >
                    </div>

                </div>

                <div class="total-sous-section">

                    <strong>Total repas :</strong>

                    <span id="totalRepas${i + 1}">
                        0,00 $
                    </span>

                </div>

            </div>

            <div class="sous-section">

                <h4>Hébergement</h4>

                <div class="hebergement-options">

                    <div>

                        <label>

                            <input
                                type="checkbox"
                                id="hotelChoix${i + 1}"
                                name="hotelChoix${i + 1}"
                            >

                            Hôtel

                        </label>

                        <input
                            type="text"
			    inputmode="decimal"
                            id="hotel${i + 1}"
                            name="hotel${i + 1}"
                            placeholder="Inscrire le montant"
                            disabled
                        >

                    </div>

                    <div>

                        <label>

                            <input
                                type="checkbox"
                                id="proches${i + 1}"
                                name="proches${i + 1}"
                            >

                            Chez des proches

                        </label>

                        <span class="montant-proches">
                            ${afficherMontant(parametresJournee.proches)}
                        </span>

                    </div>

                </div>

                <div class="total-sous-section">

                    <strong>Total hébergement :</strong>

                    <span id="totalHebergement${i + 1}">
                        0,00 $
                    </span>

                </div>

            </div>

            <div class="sous-section">

                <h4>Frais divers</h4>

                <div>

                    <label for="stationnement${i + 1}">
                        Stationnement
                    </label>

                    <input
                        type="text"
			inputmode="decimal"
                        id="stationnement${i + 1}"
                        name="stationnement${i + 1}"
                        placeholder="Inscrire le montant"
                    >

                </div>

                <div>

                    <label for="divers${i + 1}">
                        Autres
                    </label>

                    <input
                        type="text"
			inputmode="decimal"
                        id="divers${i + 1}"
                        name="divers${i + 1}"
                        placeholder="Inscrire le montant"
                    >

                </div>

                <div class="champ-justification">

                    <label for="justification${i + 1}">
                        Justification
                    </label>

                    <textarea
                        id="justification${i + 1}"
                        name="justification${i + 1}"
                        rows="3"
			maxlength="55"
                        placeholder="Préciser la nature de la dépense inscrite en 'Autres'"
                        disabled
                    ></textarea>

		    <small
			id="compteurJustification${i + 1}"
			class="compteur-justification"
		    > 0 / 55 caractères</small>

                </div>

                <div class="total-sous-section">

                    <strong>Total frais divers :</strong>

                    <span id="totalAutresDepenses${i + 1}">
                        0,00 $
                    </span>

                </div>

            </div>
	    </div>

        `;


        conteneur.appendChild(
            section
        );

	// ----------------------------------------------------
	// AFFICHER LE TAUX KILOMÉTRIQUE DE LA JOURNÉE
	// ----------------------------------------------------

	const affichageTaux =
	    document.getElementById(
		"tauxKilometrique" + (i + 1)
	    );

	if (affichageTaux) {
	    
	    affichageTaux.textContent =
		parametresJournee.tauxKilometrage.toLocaleString(
		    "fr-CA",
		    {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		    }
		) + " $ / km";
	}


        // ----------------------------------------------------
        // ACCORDÉON DE LA JOURNÉE
        // ----------------------------------------------------

	const enteteJournee =
	    section.querySelector(
		".entete-journee"
	    );

	enteteJournee.addEventListener(
	    "click",
	    function() {

		const estOuverte =
		    section.classList.contains(
			"journee-ouverte"
		    );

	 	document
		    .querySelectorAll(
			"#conteneurJournees section"
		    )
		    .forEach(
			function(autreJournee) {

			    autreJournee.classList.remove(
			        "journee-ouverte"
			    );
		        }
		    );

		if (!estOuverte) {

		    section.classList.add(
			"journee-ouverte"
		    );

		    section.scrollIntoView({
			behavior: "smooth",
			block: "start"
		    });

		}

		const icone =
		    enteteJournee.querySelector(
			".icone-journee"
		    );

		if (icone) {
		    icone.textContent =
			section.classList.contains(
			    "journee-ouverte"
			)
			    ? "▲"
			    : "▼";
		}

		const indication =
		    enteteJournee.querySelector(
			".indication-accordeon"
		    );

		if (indication) {
		
		    indication.textContent =
			section.classList.contains(
			    "journee-ouverte"
			)
			    ? "Cliquer pour masquer"
			    : "Cliquer pour afficher";
		}

	    }

	);


        // ----------------------------------------------------
        // OUVRIR LA PREMIÈRE JOURNÉE
        // ----------------------------------------------------


	if (i === 0) {

	    section.classList.add(
		"journee-ouverte"
	    );

	    const icone =
		enteteJournee.querySelector(
		    ".icone-journee"
		);

	    if (icone) {

		icone.textContent =
		    "▲";
	    }

	    const indication =
		enteteJournee.querySelector(
		    ".indication-accordeon"
		);

	    if (indication) {
	
		indication.textContent =
		    "Cliquer pour masquer";
	    }
	}


        // ----------------------------------------------------
        // CONFIGURER LES CHAMPS DE LA JOURNÉE
        // ----------------------------------------------------


        configurerJournee(
            i + 1
        );

    }

}


// ============================================================
// SÉLECTEURS DE DATE
// ============================================================

flatpickr.l10ns.fr.firstDayOfWeek = 0;


// ------------------------------------------------------------
// DATE DE DÉPART
// ------------------------------------------------------------


flatpickr(
    "#dateDepart",
    {

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
                document.createElement(
                    "button"
                );


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
                .appendChild(
                    bouton
                );

        }

    }
);


// ------------------------------------------------------------
// DATE DE RETOUR
// ------------------------------------------------------------


flatpickr(
    "#dateRetour",
    {

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
                document.createElement(
                    "button"
                );


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
                .appendChild(
                    bouton
                );

        }

    }
);


// ============================================================
// DATES DE DÉPART ET DE RETOUR
// ============================================================

// ------------------------------------------------------------
// AFFICHAGE DE LA DATE DE DÉPART
// ------------------------------------------------------------

document.getElementById(
    "dateDepart"
)
.addEventListener(
    "input",
    function() {

        const valeur =
            this.value;


        const affichage =
            document.getElementById(
                "dateDepartAffichee"
            );


        if (!affichage) {
            return;
        }


        if (!valeur) {

            affichage.textContent =
                "";

            return;

        }


        const date =
            new Date(
                valeur +
                "T00:00:00"
            );


        affichage.textContent =
            date.toLocaleDateString(
                "fr-CA",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }
);


// ------------------------------------------------------------
// MODIFICATION DE LA DATE DE DÉPART
// ------------------------------------------------------------


document.getElementById(
    "dateDepart"
)
.addEventListener(
    "change",
    function() {

        creerJournees();


        const pieces =
            document.getElementById(
                "piecesJustificatives"
            );


        if (pieces) {

            pieces.disabled =
                !this.value;

        }


        verifierChampsObligatoires();

    }
);


// ------------------------------------------------------------
// MODIFICATION DE LA DATE DE RETOUR
// ------------------------------------------------------------


document.getElementById(
    "dateRetour"
)
.addEventListener(
    "change",
    function() {

        creerJournees();

        verifierChampsObligatoires();

    }
);


// ============================================================
// CONTRÔLES DE L'ACCORDÉON
// ============================================================

const boutonToutDeplier =
    document.getElementById(
	"boutonToutDeplier"
    );

const boutonToutPlier =
    document.getElementById(
	"boutonToutPlier"
    );


// ------------------------------------------------------------
// TOUT DÉPLIER
// ------------------------------------------------------------


if (boutonToutDeplier) {

    boutonToutDeplier.addEventListener(
        "click",
        function() {

            document
                .querySelectorAll(
                    "#conteneurJournees section"
                )
                .forEach(
		    function(section) {

                        section.classList.add(
                            "journee-ouverte"
                        );

                        const icone =
                            section.querySelector(
                                ".icone-journee"
                            );

                        if (icone) {
                            icone.textContent = "▲";
                        }

			const indication =
			    section.querySelector(
				".indication-accordeon"
			    );

			if (indication) {
			    indication.textContent = 
				"Cliquer pour masquer";
			}

                    }
		);

        }
    );

}


// ------------------------------------------------------------
// TOUT PLIER
// ------------------------------------------------------------


if (boutonToutPlier) {

    boutonToutPlier.addEventListener(
        "click",
        function() {

            document
                .querySelectorAll(
                    "#conteneurJournees section"
                )
                .forEach(
		    function(section) {

                    	section.classList.remove(
                            "journee-ouverte"
                    	);

                    	const icone =
                            section.querySelector(
                            	".icone-journee"
                            );

                    	if (icone) {
                            icone.textContent = "▼";
                    	}

			const indication = 
			    section.querySelector(
				".indication-accordeon"
			    );

			if (indication) {
			    indication.textContent =
				"Cliquer pour afficher";
			}

                    }
		);

        }
    );

}


// ============================================================
// HEURE DE DÉPART ET DE RETOUR
// ============================================================

// ------------------------------------------------------------
// HEURE DE DÉPART
// ------------------------------------------------------------

document.getElementById(
    "heureDepart"
)
.addEventListener(
    "change",
    function() {

        for (
            let i = 1;
            i <= numeroJournee;
            i++
        ) {

            verifierRepas(i);

        }


        verifierChampsObligatoires();

    }
);


// ------------------------------------------------------------
// HEURE DE RETOUR
// ------------------------------------------------------------

document.getElementById(
    "heureRetour"
)
.addEventListener(
    "change",
    function() {

        for (
            let i = 1;
            i <= numeroJournee;
            i++
        ) {

            verifierRepas(i);

        }


        verifierChampsObligatoires();

    }
);


// ============================================================
// INITIALISATION
// ============================================================

creerJournees();