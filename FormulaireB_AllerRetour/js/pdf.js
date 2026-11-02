/* ================================
   GÉNÉRATION DU PDF
================================ */

async function genererPDF() {

    /* ================================
       OUTILS
    ================================ */

    function obtenirValeur(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value || ""
            : "";
    }


    function obtenirCoche(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.checked
            : false;
    }


    function obtenirNombre(id) {

    	const element =
	    document.getElementById(id);

	if (!element) {
	    return 0;
	}

	const valeur =
	    element.value !== undefined
		? element.value
		: element.textContent;

        return parseFloat(
	    String(valeur)
		.replace(/\s/g, "")
                .replace(",", ".")
        ) || 0;
    }


    function montantEnNombrePDF(texte) {

        if (!texte) {
            return 0;
        }

        return parseFloat(
            texte
                .replace(/\s/g, "")
                .replace("$", "")
                .replace(",", ".")
        ) || 0;

    }


    function formaterDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        return date.toLocaleDateString(
            "fr-CA",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }


    function montantPDF(montant) {

        return montant
            .toFixed(2)
            .replace(
                /\B(?=(\d{3})+(?!\d))/g,
                " "
            )
            .replace(
                ".",
                ","
            ) + " $";
    }


    function valeurOuTiret(valeur) {

        if (
            valeur === "" ||
            valeur === null ||
            valeur === undefined
        ) {

            return "—";
        }

        return valeur;
    }


    function imageEnDataURL(image) {

	return new Promise(
	    function(resolve, reject) {

		const canvas = 
		    document.createElement("canvas");

		canvas.width =
		    image.naturalWidth;

		canvas.height =
		    image.naturalHeight;

		const contexte =
		    canvas.getContext("2d");

		contexte.drawImage(
		    image,
		    0,
		    0
		);

		try {

		    resolve(
			canvas.toDataURL("image/png")
		    );

		} catch (erreur) {

		    reject(erreur);
		}
	    }
	);
    }


    /* ================================
       INFORMATIONS GÉNÉRALES
    ================================ */

    const nom =
        obtenirValeur("nom");

    const courriel =
        obtenirValeur("courriel");

    const adresse =
        obtenirValeur("adresse");

    const dateActivite =
        obtenirValeur("dateActivite");

    const heureDepart =
        obtenirValeur("heureDepart");

    const heureRetour =
        obtenirValeur("heureRetour");

    const motif =
        obtenirValeur("motifActivite");


    /* ================================
       TRANSPORTS
    ================================ */

    const villeDepart =
        obtenirValeur("villeDepart");

    const selectVilleDepart =
	document.getElementById("villeDepart");

    const ecoleDepart =
	(
	    selectVilleDepart?.selectedOptions[0]?.textContent.trim() || villeDepart
	)
	.replace(/\s*\([^)]*\)/g, "")
	.trim();

    const villeActivite =
        obtenirValeur("villeActivite");

    const trajetAvecArrets =
	document.getElementById("trajetAvecArrets")?.checked || false;

    const arretsAller = Array.from(
	document.querySelectorAll("#conteneurArretsAller .ville-arret")
    ).map(function(select) {
	return select.value;
    }).filter(Boolean);

    const arretsRetour = Array.from(
	document.querySelectorAll("#conteneurArretsRetour .ville-arret")
    ).map(function(select) {
	return select.value;
    }).filter(Boolean);

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

    function calculerDistanceParcoursPDF(parcours) {

	let distanceTotale = 0;
	const segments = [];

	for (let i = 0; i < parcours.length - 1; i++) {

	    const villeOrigine = parcours[i];
	    const villeDestination = parcours[i + 1];

	    const distance =
		donneesDistances[villeOrigine]?.[villeDestination];

	    if (!Number.isFinite(distance) || distance < 0) {
		return null;
	    }

	    distanceTotale += distance;

	    segments.push({
		origine: villeOrigine,
		destination: villeDestination,
		distance: distance
	    });
	}

	return {
	    distanceTotale: distanceTotale,
	    segments: segments
	};
    }

    const detailsAller = trajetAvecArrets
	? calculerDistanceParcoursPDF(parcoursAller)
	: null;

    const detailsRetour = trajetAvecArrets
	? calculerDistanceParcoursPDF(parcoursRetour)
	: null;

    function formaterParcoursDetailsPDF(details) {

	if (!details || details.segments.length === 0) {
	    return "";
	}

	return details.segments.map(function(segment, index) {

	    const distance = segment.distance.toLocaleString(
		"fr-CA",
		{
		    maximumFractionDigits: 1
		}
	    );

	    if (index === 0) {
		return segment.origine + " » " +
		    segment.destination + " (" + distance + " km)";
	    }

	    return segment.destination + " (" + distance + " km)";
	}).join(" » ");

    }

    const texteAller = trajetAvecArrets && arretsAller.length > 0
	? "Aller : " + formaterParcoursDetailsPDF(detailsAller)
	: "";

    const texteRetour = trajetAvecArrets && arretsRetour.length > 0
	? "Retour : " + formaterParcoursDetailsPDF(detailsRetour)
	: "";

    const kilometrage =
	obtenirNombre("kilometrage");

    const parametres =
	obtenirParametresPourJournee(1);

    const tauxKilometrage =
	Number(parametres?.tauxKilometrage ?? 0)
	    .toLocaleString("fr-CA", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	    });

    const locationCout =
        obtenirNombre("locationCout");

    const locationEssence =
        obtenirNombre("locationEssence");

    const codesTransports = {
	"Autobus": 1,
	"Avion": 2,
	"Taxi": 3,
	"Train": 4,
	"Transport en commun municipal": 5,
	"Traversier": 6
    };

    const transportsPublics = [];

    document
	.querySelectorAll(
	    "#conteneurTransportsPublics .transport-public-ligne"
	)
	.forEach(function(ligne) {

	    const type =
		ligne.querySelector("select[id^='typeTransportPublic']")?.value || "";

	    const champMontant =
		ligne.querySelector("input[id^='montantTransportPublic']");

	    const montant =
		montantEnNombrePDF(champMontant?.value || "");

	    if (
		type &&
		codesTransports[type] &&
		montant > 0
	    ) {
		transportsPublics.push({
		    code: codesTransports[type],
		    montant: montant
		});
	    }
	});



    const totalAutresTransports =
        montantEnNombrePDF(
            document.getElementById(
                "totalRapportAutresTransports"
            )?.textContent || ""
        );

    const totalTransports =
        kilometrage +
        totalAutresTransports;


    /* ================================
       REPAS
    ================================ */

    const annee =
        dateActivite
            ? dateActivite.substring(0, 4)
            : "";

    const parametresRepas =
        donneesParametres[annee];


    let montantDejeuner = 0;
    let montantDiner = 0;
    let montantSouper = 0;
    let montantCollation = 0;


    if (parametresRepas) {

        if (
            obtenirCoche("dejeuner")
        ) {

            montantDejeuner =
                parametresRepas.dejeuner;
        }


        if (
            obtenirCoche("diner")
        ) {

            montantDiner =
                parametresRepas.diner;
        }


        if (
            obtenirCoche("souper")
        ) {

            montantSouper =
                parametresRepas.souper;
        }


        if (
            obtenirCoche("collation")
        ) {

            montantCollation =
                parametresRepas.collation;
        }
    }

    const totalRepas =
        montantDejeuner +
        montantDiner +
        montantSouper +
        montantCollation;


    /* ================================
       AUTRES DÉPENSES
    ================================ */

    const stationnement =
        obtenirNombre("stationnement");

    const autresDepenses =
        obtenirNombre("autresDepenses");

    const justification =
        obtenirValeur("justification");


    const totalAutresDepenses =
        stationnement +
        autresDepenses;


    /* ================================
       TOTAUX
    ================================ */

    const totalRapportKilometrage =
        montantEnNombrePDF(
            document.getElementById(
                "totalRapportKilometrage"
            )?.textContent || ""
        );

    const totalRapportLocation =
        montantEnNombrePDF(
            document.getElementById(
                "totalRapportLocation"
            )?.textContent || ""
        );

    const totalRapportTransportsPublics =
	montantEnNombrePDF(
	    document.getElementById(
		"totalRapportTransportsPublics"
	    )?.textContent || ""
	);

    const totalRapportRepas =
        montantEnNombrePDF(
            document.getElementById(
                "totalRapportRepas"
            )?.textContent || ""
        );


    const totalRapportAutresDepenses =
        montantEnNombrePDF(
            document.getElementById(
                "totalRapportAutresDepenses"
            )?.textContent || ""
        );


    const totalRapportGeneral =
        montantEnNombrePDF(
            document.getElementById(
                "totalRapportGeneral"
            )?.textContent || ""
        );


    /* ================================
       PIÈCES JUSTIFICATIVES
    ================================ */

    const inputPieces =
        document.getElementById(
            "piecesJustificatives"
        );

    const fichiers =
        inputPieces &&
        inputPieces._fichiersSelectionnes
            ? inputPieces._fichiersSelectionnes
            : [];



    /* ================================
       CRÉER LE PDF
    ================================ */

    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter"
        });


    const largeurPage =
        pdf.internal.pageSize.getWidth();

    const hauteurPage =
        pdf.internal.pageSize.getHeight();


    const marge =
        10;

    const largeur =
        largeurPage -
        marge * 2;


    let y =
        marge;


    /* ================================
       COULEURS
    ================================ */

    const couleurTitre =
        [53, 67, 82];

    const couleurEntete =
        [225, 229, 233];

    const couleurBordure =
        [159, 170, 179];

    const couleurTexte =
        [32, 42, 51];


    pdf.setTextColor(
        ...couleurTexte
    );


    /* ================================
       MISE EN PAGE
    ================================ */

    function titreSection(texte) {

        pdf.setFillColor(
            ...couleurTitre
        );

        pdf.setTextColor(
            255,
            255,
            255
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

    	pdf.setFontSize(
	    9
	);


        pdf.rect(
            marge,
            y,
            largeur,
            7,
            "F"
        );


        pdf.text(
            texte,
            marge + 2,
            y + 4.8
        );

        y += 7;

        pdf.setTextColor(
            ...couleurTexte
        );
    }


    function cellule(
        x,
        largeurCellule,
        hauteurCellule,
        texte,
        options = {}
    ) {

	x = Number(x);
	largeurCellule = Number(largeurCellule);
	hauteurCellule = Number(hauteurCellule);


        const fond =
            options.fond || null;

        const gras =
            options.gras || false;

        const alignement =
            options.alignement || "left";


        if (fond) {

            pdf.setFillColor(
                ...fond
            );

            pdf.rect(
                x,
                y,
                largeurCellule,
                hauteurCellule,
                "F"
            );
        }


        pdf.setDrawColor(
            ...couleurBordure
        );


        pdf.rect(
            x,
            y,
            largeurCellule,
            hauteurCellule
        );


	const couleurTexteCellule =
	    options.couleurTexte || couleurTexte;


        pdf.setTextColor(
            ...couleurTexteCellule
        );

        pdf.setFont(
            "helvetica",
            gras
                ? "bold"
                : "normal"
        );

        pdf.setFontSize(
            options.taille || 8
        );


        const texteAffiche =
            valeurOuTiret(texte);


        let positionX = x + 2;
	let alignementFinal = alignement;

	if (texteAffiche === "—") {

	    positionX =
		x +
		largeurCellule / 2;

	    alignementFinal = "center";

	} else {

	    if (alignement === "right") {
		positionX =
		    x + 
		    largeurCellule -
		    2;

	    }



        if (alignement === "center") {
            positionX =
                x +
                largeurCellule / 2;
        }

    }

	
	const lignes =
	    String(texteAffiche).split("\n");

	const hauteurTexte =
	    pdf.getLineHeight() /
	    pdf.internal.scaleFactor;

	const hauteurTotale =
	    (lignes.length - 1) *
	    hauteurTexte;

	const positionY =
	    y +
	    hauteurCellule / 2 -
	    hauteurTotale / 2 +
	    hauteurTexte / 2;


        pdf.text(
            lignes,
            positionX,
            positionY,
            {
                align: alignementFinal
            }
        );
    }


    function ligneTableau() {

        y += 6;
    }


    /* ================================
       EN-TÊTE GÉNÉRAL
    ================================ */

    const logoPDF = 
	document.getElementById("logoPDF");

    if (
	logoPDF &&
	logoPDF.complete &&
	logoPDF.naturalWidth > 0
    ) {

	const logoDataURL =
	    await imageEnDataURL(
		logoPDF
	    );

	const largeurLogo = 24;
	const hauteurLogo =
	    largeurLogo *
	    (logoPDF.naturalHeight / logoPDF.naturalWidth);

	pdf.addImage(
	    logoDataURL,
	    "PNG",
	    marge + 5,
	    y,
	    largeurLogo,
	    hauteurLogo
	);

    }

    const centrePage =
	marge + largeur / 2;


    pdf.setTextColor(
	...couleurTitre
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        15
    );


    pdf.text(
        "RAPPORT DE DÉPLACEMENTS",
        centrePage,
        y + 9,
	{
	    align: "center"
	}
    );

    pdf.setFont(
	"helvetica",
	"normal"
    );

    pdf.setFontSize(
	9.5
    );

    pdf.text(
	"Formulaire de remboursement — déplacement 1 journée",
	centrePage,
	y + 14.5,
	{
	    align: "center"
	}
    );

    pdf.setDrawColor(
	...couleurBordure
    );

    pdf.setLineWidth(
	0.3
    );

    pdf.line(
	marge,
	y + 28,
	marge + largeur,
	y + 28
    );

    pdf.setLineWidth(
	0.2
    );

    y += 33;


    /* ================================
       IDENTIFICATION
    ================================ */

    titreSection(
	"IDENTIFICATION"
    );

    pdf.setFontSize(
        8
    );


    let hauteurLigne =
        7;


    let x =
        marge;


    const largeur1 =
        largeur * 0.16;

    const largeur2 =
        largeur * 0.34;

    const largeur3 =
        largeur * 0.16;

    const largeur4 =
        largeur * 0.34;


    cellule(
        x,
        largeur1,
        hauteurLigne,
        "Nom",
        {
            fond: couleurEntete,
            gras: true
        }
    );

    x += largeur1;

    cellule(
        x,
        largeur2,
        hauteurLigne,
        nom
    );

    x += largeur2;

    cellule(
        x,
        largeur3,
        hauteurLigne,
        "Date du rapport",
        {
            fond: couleurEntete,
            gras: true
        }
    );

    x += largeur3;

    cellule(
        x,
        largeur4,
        hauteurLigne,
        formaterDate(
            new Date()
                .toISOString()
                .slice(0, 10)
        )
    );

    y += hauteurLigne;


    x = marge;


    cellule(
        x,
        largeur1,
        hauteurLigne,
        "Adresse",
        {
            fond: couleurEntete,
            gras: true
        }
    );

    x += largeur1;

    cellule(
        x,
        largeur2,
        hauteurLigne,
        adresse
    );

    x += largeur2;

    cellule(
        x,
        largeur3,
        hauteurLigne,
        "Courriel",
        {
            fond: couleurEntete,
            gras: true
        }
    );

    x += largeur3;

    cellule(
        x,
        largeur4,
        hauteurLigne,
        courriel
    );

    y += hauteurLigne;


    x = marge;

    cellule(
        x,
        largeur1,
        hauteurLigne,
        "Activité",
        {
            fond: couleurEntete,
            gras: true
        }
    );

    x += largeur1;

    cellule(
        x,
        largeur2,
        hauteurLigne,
        formaterDate(
            dateActivite
        )
    );

    x += largeur2;

    cellule(
        x,
        largeur3,
        hauteurLigne,
        "Horaire",
        {
            fond: couleurEntete,
            gras: true
        }
    );

    x += largeur3;

    cellule(
        x,
        largeur4,
        hauteurLigne,
        heureDepart +
        " à " +
        heureRetour
    );

    y += hauteurLigne;


    x = marge;

    cellule(
        x,
        largeur1,
        hauteurLigne,
        "Nature de l'activité",
        {
            fond: couleurEntete,
            gras: true
        }
    );

    x += largeur1;

    cellule(
        x,
        largeur2 +
        largeur3 +
        largeur4,
	hauteurLigne,
        motif
    );

    y += hauteurLigne + 8;


    /* ================================
       ACTIVITÉ ET TRANSPORTS
    ================================ */

    titreSection(
        "ACTIVITÉ ET TRANSPORTS"
    );


    const largeursTransports = [
        largeur * 0.25,
        largeur * 0.25,
        largeur * 0.10,
        largeur * 0.10,
        largeur * 0.08,
	largeur * 0.08,
        largeur * 0.14
    ];


    const entetesTransports = [
        "École la plus près du\nlieu de départ",
        "Ville de l'activité",
        "Kilomètres\n(" + tauxKilometrage + " $/km)",
	"Montant",
        "Location",
        "Essence",
        "Transport public"
    ];


    x = marge;


    entetesTransports.slice(0, 4).forEach(
        function(entete, index) {

            cellule(
                x,
                largeursTransports[index],
                10,
                entete,
                {
                    fond: couleurEntete,
                    gras: true,
                    alignement: "center",
                    taille: 8
                }
            );

            x +=
                largeursTransports[index];

        }
    );


    // En-tête principal Location

    const positionLocation = x;

    const largeurLocation =
	largeursTransports[4] +
	largeursTransports[5];

    const yEntete = y;
    const hauteurPrincipale = 5;
    const hauteurSousEntete = 5;


// --------------------------------------------------------
// GROUPE : LOCATION — EN-TÊTE PRINCIPAL
// --------------------------------------------------------

    cellule(
	positionLocation,
	largeurLocation,
	hauteurPrincipale,
	"Location",
	{
	    fond: couleurEntete,
	    gras: true,
	    alignement: "center",
	    taille: 8
	}
    );


// --------------------------------------------------------
// SOUS-EN-TÊTES : COÛT ET ESSENCE
// --------------------------------------------------------

    y = yEntete + hauteurPrincipale;

    cellule(
	positionLocation,
	largeursTransports[4],
	hauteurSousEntete,
	"Coût",
	{
	    fond: couleurEntete,
	    gras: true,
	    alignement: "center",
	    taille: 7
	}
    );

    cellule(
	positionLocation + largeursTransports[4],
	largeursTransports[5],
	hauteurSousEntete,
	"Essence",
	{
	    fond: couleurEntete,
	    gras: true,
	    alignement: "center",
	    taille: 7
	}
    );

// --------------------------------------------------------
// EN-TÊTE : TRANSPORT PUBLIC
// --------------------------------------------------------

    y = yEntete;

    cellule(
	positionLocation + largeurLocation,
	largeursTransports[6],
	hauteurPrincipale + hauteurSousEntete,
	entetesTransports[6],
	{
	    fond: couleurEntete,
	    gras: true,
	    alignement: "center",
	    taille: 8
	}
    );


    y += 10;

    const hauteurLigneTransports =
	Math.max(7, transportsPublics.length * 4.5);


    const valeursTransports = [
        ecoleDepart,
        villeActivite,
        kilometrage
            ? kilometrage
                .toFixed(2)
                .replace(".", ",") +
            " km"
            : "—",
	totalRapportKilometrage
	    ? montantPDF(totalRapportKilometrage)
	    : "—",
        locationCout
            ? montantPDF(locationCout)
            : "—",
        locationEssence
            ? montantPDF(locationEssence)
            : "—",
        ""
    ];


    x = marge;


    valeursTransports.slice(0, 6).forEach(
        function(valeur, index) {

            cellule(
                x,
                largeursTransports[index],
                hauteurLigneTransports,
                valeur,
                {
                    alignement:
                        index >= 2
                            ? "right"
                            : "left",
                    taille: 7.5
                }
            );

            x +=
                largeursTransports[index];

        }
    );


    // --------------------------------------------------------
    // TRANSPORTS PUBLICS
    // --------------------------------------------------------

    const hauteurTransportPublic =
	hauteurLigneTransports;

    cellule(
	marge +
	    largeursTransports.slice(0, 6).reduce(
		(total, largeurColonne) => total + largeurColonne,
		0
	    ),
	largeursTransports[6],
	hauteurTransportPublic,
	" ",
	{
	    taille: 7.5
	}
    );

    transportsPublics.forEach(
	function(transport, index) {

	    const hauteurLigne =
	 	hauteurTransportPublic / transportsPublics.length;

	    const positionY =
		y +
		index * hauteurLigne +
		hauteurLigne / 2 +
		1;

	    pdf.setFont(
		"helvetica", 
		"normal"
	    );

	    pdf.setFontSize(7.5);

	    pdf.text(
		transport.code + ".",
		marge +
		    largeursTransports.slice(0, 6).reduce(
			(total, largeurColonne) => total + largeurColonne,
			0
		    ) + 2,
		positionY
	    );

	    pdf.text(
		montantPDF(transport.montant),
		marge +
		    largeursTransports.slice(0, 7).reduce(
			(total, largeurColonne) => total + largeurColonne,
			0
		    ) - 2,
		positionY,
		{
		    align: "right"
		}
	    );
	}
    );


    y += hauteurLigneTransports;

    // --------------------------------------------------------
    // CELLULE : ITINÉRAIRE DÉTAILLÉ
    // --------------------------------------------------------

    if (texteAller || texteRetour) {

	const textesItineraires = [];

	if (texteAller) {
	    textesItineraires.push({
		libelle: "Aller : ",
		texte: texteAller.replace(
		    /^Aller\s*:\s*/i,
		    ""
		)
	    });
	}

	if (texteRetour) {
	    textesItineraires.push({
		libelle: "Retour : ",
		texte: texteRetour.replace(
		    /^Retour\s*:\s*/i,
		    ""
		)
	    });
	}

	const tailleTexteItineraire = 7;
	const hauteurLigneItineraire = 3.3;
	const positionTexteX = marge + 2;
	const largeurTexte = largeur - 4;

	pdf.setFont("helvetica", "normal");
	pdf.setFontSize(tailleTexteItineraire);

	const lignesItineraire = textesItineraires.map(
	    function(element) {

		pdf.setFont("helvetica", "bold");

		const largeurLibelle = pdf.getTextWidth(
		    element.libelle
		);

		pdf.setFont("helvetica", "normal");

		const lignesDetail = pdf.splitTextToSize(
		    element.texte,
		    largeurTexte - largeurLibelle
	    	);

		return {
		    libelle: element.libelle,
		    largeurLibelle: largeurLibelle,
		    lignesDetail: lignesDetail
		};
	    }

	);

	const nombreLignes = lignesItineraire.reduce(
	    function(total, element) {
		return total + Math.max(
		    1,
		    element.lignesDetail.length
		);
	    },
	    0
	);

        const hauteurCelluleItineraire =
            8.5 +
            (nombreLignes - 1) * hauteurLigneItineraire;

        // Bordure de la cellule
        pdf.setDrawColor(...couleurBordure);

        pdf.rect(
            marge,
            y,
            largeur,
            hauteurCelluleItineraire
        );

        // Titre de la cellule
        pdf.setTextColor(...couleurTexte);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7.5);

        pdf.text(
            "Itinéraire détaillé",
            marge + 2,
            y + 3.2
        );

        // Impression des parcours
        let positionY = y + 6.5;

        lignesItineraire.forEach(
            function(element) {

                // Libellé en gras
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(tailleTexteItineraire);

                pdf.text(
                    element.libelle,
                    positionTexteX,
                    positionY
                );

                // Première ligne du parcours en caractères normaux
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(tailleTexteItineraire);

                pdf.text(
                    element.lignesDetail[0] || "",
                    positionTexteX + element.largeurLibelle,
                    positionY
                );

                positionY += hauteurLigneItineraire;

                // Lignes suivantes alignées sous le parcours
                if (element.lignesDetail.length > 1) {

                    const lignesSupplementaires =
                        element.lignesDetail.slice(1);

                    pdf.text(
                        lignesSupplementaires,
                        positionTexteX,
                        positionY,
                        {
                            lineHeightFactor: 1
                        }
                    );

                    positionY +=
                        lignesSupplementaires.length *
                        hauteurLigneItineraire;
                }
            }
        );

        y += hauteurCelluleItineraire + 1;
    }

    // --------------------------------------------------------
    // LÉGENDE DES TRANSPORTS PUBLICS
    // --------------------------------------------------------

    if (transportsPublics.length > 0) {

	const elementsLegende = [
	    "1. Autobus",
	    "2. Avion",
	    "3. Taxi",
	    "4. Train",
	    "5. Transport en commun municipal",
	    "6. Traversier"
	];

	const hauteurCelluleLegende = 9.5;

	pdf.setDrawColor(...couleurBordure);

	pdf.rect(
	    marge,
	    y,
	    largeur,
	    hauteurCelluleLegende
	);

	pdf.setTextColor(...couleurTexte);
	pdf.setFont("helvetica", "bold");
	pdf.setFontSize(7.5);

	pdf.text(
	    "Légende des transports publics",
	    marge + 2,
	    y + 3.2
	);

	pdf.setFont("helvetica", "normal");
	pdf.setFontSize(7);

	let positionLegendeX = marge + 2;
	const positionLegendeY = y + 7.5;

	elementsLegende.forEach(function(texte, index) {

	    pdf.text(
		texte,
		positionLegendeX,
		positionLegendeY
	    );

	    positionLegendeX += pdf.getTextWidth(texte);

	    if (index < elementsLegende.length - 1) {

		positionLegendeX += 2;

		pdf.setFillColor(...couleurTexte);

		pdf.circle(
		    positionLegendeX,
		    positionLegendeY - 1,
		    0.45,
		    "F"
		);

		positionLegendeX += 2;

	    }
	});

	y += hauteurCelluleLegende + 1;

    }


    y += 3;


    /* ================================
       REPAS ET AUTRES DÉPENSES
    ================================ */

    titreSection(
        "REPAS ET AUTRES DÉPENSES"
    );


    const largeursRepasDepenses = [
        largeur * 0.12,
        largeur * 0.12,
        largeur * 0.12,
        largeur * 0.12,
        largeur * 0.12,
        largeur * 0.15,
        largeur * 0.25
    ];


    const entetesRepasDepenses = [
        "Déjeuner",
        "Dîner",
        "Souper",
        "Collation",
	"Stationnement",
	"Autres dépenses",
	"Justification"
    ];


    x = marge;


    entetesRepasDepenses.forEach(
        function(entete, index) {

            cellule(
                x,
                largeursRepasDepenses[index],
                7,
                entete,
                {
                    fond: couleurEntete,
                    gras: true,
                    alignement: "center",
		    taille: 8
                }
            );

            x +=
                largeursRepasDepenses[index];

        }
    );


    y += 7;


    const valeursRepasDepenses = [
        montantDejeuner
            ? montantPDF(montantDejeuner)
            : "—",

        montantDiner
            ? montantPDF(montantDiner)
            : "—",

        montantSouper
            ? montantPDF(montantSouper)
            : "—",

        montantCollation
            ? montantPDF(montantCollation)
            : "—",

        stationnement
            ? montantPDF(stationnement)
            : "—",

        autresDepenses
            ? montantPDF(autresDepenses)
            : "—",

	justification

    ];


    x = marge;


    valeursRepasDepenses.forEach(
        function(valeur, index) {

            cellule(
                x,
                largeursRepasDepenses[index],
		justification.length > 70
		    ? 12
		    : 7,
                valeur,
                {
                    alignement: 
			index === 6
			    ? "left"
			    : "right",
		    taille: 7.5
                }
            );

            x +=
                largeursRepasDepenses[index];

        }
    );

    y +=
	justification.length > 70
	    ? 12
	    : 7;


    y += 5;


    /* ================================
       PIÈCES JUSTIFICATIVES
    ================================ */

    if (
        fichiers.length > 0
    ) {

        titreSection(
            "PIÈCES JUSTIFICATIVES"
        );


        cellule(
            marge,
            largeur,
            6,
            "Fichier",
            {
                fond: couleurEntete,
                gras: true
            }
        );

        y += 6;


        fichiers.forEach(
            function(fichier) {

                cellule(
                    marge,
                    largeur,
                    6,
                    fichier.name,
                    {
                        taille: 7.5
                    }
                );

                y += 6;

            }
        );


        y += 10;
    }


    /* ================================
       TOTAL DU RAPPORT
    ================================ */

    titreSection(
        "TOTAL DU RAPPORT"
    );


    const largeursTotaux = [
        largeur * 0.15,
        largeur * 0.15,
        largeur * 0.15,
        largeur * 0.15,
	largeur * 0.18,
        largeur * 0.22
    ];


    const entetesTotaux = [
        "Kilométrage",
	"Location",
        "Transport public",
        "Repas",
        "Autres dépenses",
        "TOTAL GÉNÉRAL"
    ];


    x = marge;


    entetesTotaux.forEach(
        function(entete, index) {

            cellule(
                x,
                largeursTotaux[index],
                7,
                entete,
                {
                    fond:
                        index === 5
                            ? couleurTitre
                            : couleurEntete,
                    gras: true,
                    alignement: "center",
                    taille: 8,
		    couleurTexte:
			index === 5
			    ? [255, 255, 255]
 			    : couleurTexte
                }
            );

            x +=
                largeursTotaux[index];

        }
    );


    y += 7;


    const valeursTotaux = [
        montantPDF(
            totalRapportKilometrage
        ),
        montantPDF(
            totalRapportLocation
        ),
	montantPDF(
	    totalRapportTransportsPublics
	),
        montantPDF(
            totalRapportRepas
        ),
        montantPDF(
            totalRapportAutresDepenses
        ),
        montantPDF(
            totalRapportGeneral
        )
    ];


    x = marge;


    valeursTotaux.forEach(
        function(valeur, index) {

            cellule(
                x,
                largeursTotaux[index],
                7,
                valeur,
                {
		    fond:
			index === 5
			    ? [248, 249, 250]
			    : null,
		    gras:
			index === 5,
                    alignement: "right",
                    taille:
                        index === 5
                            ? 10
                            : 7.5
                }
            );

            x +=
                largeursTotaux[index];

        }

    );


    y += 11;


    /* ================================
       RÉSERVÉ À L'ADMINISTRATION
       ANCRÉ AU BAS DE LA PAGE
    ================================ */

    const hauteurAdministration =
        48;


    const positionAdministration =
        hauteurPage -
        marge -
        hauteurAdministration;


    titreAdministrationPDF(
        pdf,
        marge,
        positionAdministration,
        largeur
    );


    const yAdministration =
        positionAdministration + 7;


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        8
    );

    pdf.setFillColor(
        ...couleurEntete
    );

    pdf.setTextColor(
        ...couleurTexte
    );

    pdf.setDrawColor(
	...couleurBordure
    );

    pdf.rect(
        marge,
        yAdministration,
        largeur * 0.67,
        7,
        "FD"
    );

    pdf.rect(
        marge + largeur * 0.67,
        yAdministration,
        largeur * 0.33,
        7,
        "FD"
    );


    pdf.text(
        "Poste budgétaire",
        marge + 2,
        yAdministration + 4.7
    );


    pdf.text(
        "$",
        marge +
        largeur * 0.67 +
        2,
        yAdministration + 4.7
    );


    let ligneAdministration =
        yAdministration + 7;


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        pdf.rect(
            Number(marge),
            Number(ligneAdministration),
            Number(largeur) * 0.67,
            6
        );

        pdf.rect(
            Number(marge) +
            Number(largeur) * 0.67,
            Number(ligneAdministration),
            Number(largeur) * 0.33,
            6
        );

        ligneAdministration += 6;

    }


    pdf.setLineWidth(0.2);


    pdf.rect(
        Number(marge),
        Number(ligneAdministration),
        Number(largeur) * 0.67,
        8
    );

    pdf.rect(
        Number(marge) +
        Number(largeur) * 0.67,
        Number(ligneAdministration),
        Number(largeur) * 0.33,
        8
    );

    /* Double barre supérieure */
    pdf.line(
	Number(marge),
	Number(ligneAdministration) + 1.2,
	Number(marge) + Number(largeur),
	Number(ligneAdministration) + 1.2
    );


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.text(
        "Autorisé par :",
        marge + 2,
        ligneAdministration + 5
    );

    pdf.text(
        "Date",
        marge +
        largeur * 0.67 +
        2,
        ligneAdministration + 5
    );


    /* ================================
       NUMÉRO DE PAGE
    ================================ */

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        7
    );

    pdf.setTextColor(
        110,
        110,
        110
    );


    pdf.text(
        "Page 1",
        largeurPage - marge,
        hauteurPage - 3,
        {
            align: "right"
        }
    );


    /* ================================
       RETOUR
    ================================ */

    return pdf;

}


/* ================================
   TITRE ADMINISTRATION
================================ */

function titreAdministrationPDF(
    pdf,
    x,
    y,
    largeur
) {

    pdf.setFillColor(
        53,
        67,
        93
    );

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        9
    );

    pdf.rect(
        x,
        y,
        largeur,
        7,
        "F"
    );

    pdf.text(
        "RÉSERVÉ À L'ADMINISTRATION",
        x + 2,
        y + 4.8
    );
}


/* ================================
   BOUTON GÉNÉRER PDF
================================ */

document.getElementById("boutonGenererPDF")
    .addEventListener(
        "click",
        async function() {

            const pdf =
                await genererPDF();

            if (!pdf) {
                return;
            }

            pdf.save(
                "Rapport_de_deplacements.pdf"
            );
        }
    );


// ============================================================
// BOUTON « IMPRIMER »
// ============================================================

document.getElementById(
    "boutonImprimer"
)
.addEventListener(
    "click",
    async function() {


        const pdf =
            await genererPDF();


        if (!pdf) {
            return;
        }


        const pdfBlob =
            pdf.output(
                "blob"
            );


        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            );

	window.open(
	    pdfUrl,
	    "_blank"
	);

    }
);