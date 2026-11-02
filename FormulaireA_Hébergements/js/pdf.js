// ============================================================
// GÉNÉRATION DU PDF
// ============================================================

async function genererPDF() {


    // ========================================================
    // OUTILS DE FORMATAGE ET DE LECTURE
    // ========================================================

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


    function formaterDateCourte(dateString) {

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
                month: "short"
            }
        );

    }


    function obtenirDateJournee(numero) {

        const dateDepart =
            obtenirValeur(
                "dateDepart"
            );


        if (!dateDepart) {
            return "";
        }


        const date =
            new Date(
                dateDepart + "T00:00:00"
            );


        date.setDate(
            date.getDate() + numero - 1
        );


        return (
            date.getFullYear() +
            "-" +
            String(
                date.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                date.getDate()
            ).padStart(2, "0")
        );

    }


    function obtenirParametres(numero) {

        return obtenirParametresPourJournee(
            numero
        );

    }


    function montantPDF(montant) {

	const nombre =
	    Number(montant) || 0;

        return nombre
            .toFixed(2)
            .replace(".", ",") +
            " $";

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


    // ========================================================
    // INFORMATIONS GÉNÉRALES
    // ========================================================

    const nom =
        obtenirValeur("nom");


    const adresse =
        obtenirValeur("adresse");


    const courriel =
        obtenirValeur("courriel");


    const dateDepart =
        obtenirValeur("dateDepart");


    const heureDepart =
        obtenirValeur("heureDepart");


    const dateRetour =
        obtenirValeur("dateRetour");


    const heureRetour =
        obtenirValeur("heureRetour");


    const motif =
        obtenirValeur("motifActivite");


    // ========================================================
    // NOMBRE DE JOURNÉES
    // ========================================================

    let nombreJournees =
        numeroJournee;


    if (!nombreJournees) {

        if (
            dateDepart &&
            dateRetour
        ) {

            const debut =
                new Date(
                    dateDepart +
                    "T00:00:00"
                );


            const fin =
                new Date(
                    dateRetour +
                    "T00:00:00"
                );


            nombreJournees =
                Math.round(
                    (fin - debut) /
                    (1000 * 60 * 60 * 24)
                ) + 1;

        }
        else if (dateDepart) {

            nombreJournees =
                1;

        }
        else {

            return null;

        }

    }


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


    // ========================================================
    // CRÉER LE DOCUMENT PDF
    // ========================================================

    const {
	jsPDF
    } = window.jspdf;

    const pdf =
	new jsPDF({
	    orientation: "portrait",
	    unit: "mm",
	    format: "letter"
	});


    // ========================================================
    // DIMENSIONS DE LA PAGE
    // ========================================================

    const largeurPage =
	pdf.internal.pageSize.getWidth();

    const hauteurPage =
	pdf.internal.pageSize.getHeight();

    const marge = 10;

    const largeur =
	largeurPage -
	marge * 2;

    let y = marge;
    let numeroPage = 1;

    const hauteurEntete =
	33;

    const hauteurNumeroPage =
	5;

    const limiteContenu =
	hauteurPage -
	marge -
	hauteurNumeroPage;


    // ========================================================
    // COULEURS
    // ========================================================

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


    // ========================================================
    // MISE EN PAGE
    // ========================================================

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
	    6,
	    "F"
    	);

    	pdf.text(
	    texte,
	    marge + 2,
	    y + 4.8
    	);

    	y += 6;

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
	    (pdf.getFontSize() * 0.3528) * 1.15;

	const hauteurTotale =
	    (lignes.length - 1) *
	    hauteurTexte;

	const positionY =
	    y +
	    hauteurCellule / 2 -
	    hauteurTotale / 2 +
	    hauteurTexte * 0.35;


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

    async function dessinerEntetePDF() {

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

	const largeurLogo = 26.5;

	const hauteurLogo =
	    largeurLogo *
	    (logoPDF.naturalHeight / logoPDF.naturalWidth);

	pdf.addImage(
	    logoDataURL,
	    "PNG",
	    marge + 9,
	    y - 2,
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
	"Formulaire de remboursement — déplacement 2 jours ou plus",
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

    }


    // ========================================================
    // PAGINATION
    // ========================================================

    async function nouvellePagePDF() {

    	pdf.addPage();
	
	numeroPage++;

	y = marge;

	await dessinerEntetePDF();

    }

    function espaceDisponiblePDF() {

	return (
	    limiteContenu -
	    y
	);

    }


    async function verifierEspacePDF(
	hauteurNecessaire
    ) {

	if (
	    y + hauteurNecessaire >
	    limiteContenu
 	) {

	    await nouvellePagePDF();

	    return true;

	}

	return false;

    }


    await dessinerEntetePDF();

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
	5;


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


    /* --------------- LIGNE 1 --------------- */


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
	nom,
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



    /* --------------- LIGNE 2 --------------- */

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

    x+= largeur3;


    cellule(
	x,
	largeur4,
	hauteurLigne,
	courriel
    );

    y += hauteurLigne;



    /* --------------- LIGNE 3 --------------- */

    x = marge;


    cellule(
	x,
	largeur1,
	hauteurLigne,
	"Départ",
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
	formaterDate(dateDepart) +
	" à " +
	heureDepart
    );

    x += largeur2;


    cellule(
	x,
	largeur3,
	hauteurLigne,
	"Retour",
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
	formaterDate(dateRetour) +
	" à " +
	heureRetour
    );

    y += hauteurLigne;



    /* --------------- LIGNE 4 --------------- */

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

    y += hauteurLigne + 4;


    // ========================================================
    // ACTIVITÉS ET TRANSPORTS + FRAIS DE SÉJOUR
    // PAGINATION SYNCHRONISÉE PAR JOURNÉE
    // ========================================================


    const largeursTransports = [
	largeur * 0.04,
	largeur * 0.08,
	largeur * 0.16,
	largeur * 0.16,
	largeur * 0.075,
	largeur * 0.075,
	largeur * 0.10,
	largeur * 0.075,
	largeur * 0.075,
	largeur * 0.16
    ];


    const largeursDepenses = [
	largeur * 0.04,
	largeur * 0.08,
	largeur * 0.08,
	largeur * 0.08,
	largeur * 0.08,
	largeur * 0.08,
	largeur * 0.08,
	largeur * 0.08,
	largeur * 0.08,
	largeur * 0.32
    ];


    const entetesDepenses = [
	"Jour",
	"Déj.",
	"Dîner",
	"Souper",
	"Coll.",
	"Hôtel",
	"Proches",
	"Stat.",
	"Autres",
	"Justification"
    ];


    // --------------------------------------------------------
    // EN-TÊTE ACTIVITÉS ET TRANSPORTS
    // --------------------------------------------------------


    function dessinerEnteteTransports() {

	const hauteurEntete = 10;
	const hauteurPrincipale = 5;
	const hauteurSousEntete = 5;

	const yEntete = y;

    	x = marge;

    	// ----------------------------------------------------
    	// EN-TÊTES SIMPLES : HAUTEUR COMPLÈTE
    	// ----------------------------------------------------
	
	const entetesSimples = [
	    { index: 0, texte: "Jour" },
	    { index: 1, texte: "Date" },
	    { index: 2, texte: "Ville de départ" },
	    { index: 3, texte: "Ville d'arrivée" },
	    { index: 6, texte: "Montant" },
	    { index: 9, texte: "Transport\npublic" }
	];
    

    	entetesSimples.forEach(function(entete) {

	    const positionX =
		marge +
		largeursTransports
		    .slice(0, entete.index)
		    .reduce((total, valeur) => total + valeur, 0);

	    cellule(
		positionX,
		largeursTransports[entete.index],
		hauteurEntete,
		entete.texte,
		{
		    fond: couleurEntete,
		    gras: true,
		    alignement: "center",
		    taille: 7.5
		}
	    );

	});

	const parametres =
	    obtenirParametresPourJournee(1);

	const tauxKilometrage =
	    Number(parametres.tauxKilometrage)
		.toLocaleString("fr-CA", {
		    minimumFractionDigits: 2,
		    maximumFractionDigits: 2
		});

    	// ----------------------------------------------------
    	// GROUPE : KILOMÈTRES
    	// ----------------------------------------------------

	const positionKilometres =
	    marge +
	    largeursTransports
		.slice(0, 4)
		.reduce((total, valeur) => total + valeur, 0);

	const largeurKilometres =
	    largeursTransports[4] +
	    largeursTransports[5];

	cellule(
	    positionKilometres,
	    largeurKilometres,
	    hauteurPrincipale,
	    "Kilomètres (" + tauxKilometrage + " $/km)",
	    {
		fond: couleurEntete,
		gras: true,
		alignement: "center",
		taille: 7.5
	    }
	);

	y = yEntete + hauteurPrincipale;

	cellule(
	    positionKilometres,
	    largeursTransports[4],
	    hauteurSousEntete,
	    "Transit",
	    {
		fond: couleurEntete,
		gras: true,
		alignement: "center",
		taille: 7
	    }
	);

	cellule(
	    positionKilometres + largeursTransports[4],
	    largeursTransports[5],
	    hauteurSousEntete,
	    "Locaux",
	    {
		fond: couleurEntete,
		gras: true,
		alignement: "center",
		taille: 7
	    }
	);


    	// ----------------------------------------------------
    	// GROUPE : LOCATION
    	// ----------------------------------------------------

	const positionLocation =
	    marge +
	    largeursTransports
		.slice(0, 7)
		.reduce((total, valeur) => total + valeur, 0);

	const largeurLocation =
	    largeursTransports[7] +
	    largeursTransports[8];

	y =yEntete;

	cellule(
	    positionLocation,
	    largeurLocation,
	    hauteurPrincipale,
	    "Location",
	    {
		fond: couleurEntete,
		gras: true,
		alignement: "center",
		taille: 7.5
	    }
	);

	y = yEntete + hauteurPrincipale;

	cellule(
	    positionLocation,
	    largeursTransports[7],
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
	    positionLocation + largeursTransports[7],
	    largeursTransports[8],
	    hauteurSousEntete,
	    "Essence",
	    {
		fond: couleurEntete,
		gras: true,
		alignement: "center",
		taille: 7
	    }
	);


    	y = yEntete + hauteurEntete;

    }


    // --------------------------------------------------------
    // EN-TÊTE FRAIS DE SÉJOUR
    // --------------------------------------------------------

    function dessinerEntetesDepenses() {

    	x = marge;


    	entetesDepenses.forEach(
	    function(entete, index) {

	    	cellule(
		    x,
		    largeursDepenses[index],
		    7,
		    entete,
		    {
		    	fond: couleurEntete,
		    	gras: true,
		    	alignement: "center",
		    	taille: 8
		    }
	    	);

	    	x += largeursDepenses[index];

	    }
        );


    	y += 7;

    }


    // --------------------------------------------------------
    // CALCUL DU NOMBRE DE JOURNÉES PAR PAGE
    // --------------------------------------------------------

    const hauteurIndicateurSuite = 5;

    function obtenirNombreJourneesParPage(
	hauteurSupplementaire = 0,
	reserverIndicateurFin = false,
	journeesRestantes = nombreJournees,
	hauteurLegende = 0
    ) {

	const hauteurFixe =
	    6 +    // titre activités
	    10 +    // en-tête activités à deux niveaux
	    4 +    // espace entre les deux tableaux
	    6 +    // titre frais
	    7 +    // en-tête frais
	    4;    // espace après le 2e tableau


	const espaceDisponible =
	    limiteContenu -
	    y -
	    hauteurSupplementaire -
	    hauteurLegende -
	    (reserverIndicateurFin 
		? hauteurIndicateurSuite 
		: 0
	    );

	let espaceUtilise = hauteurFixe;
	let nombre = 0;

	for (
	    let i = premiereJournee;
	    i < premiereJournee + journeesRestantes;
	    i++
	) {

	    const hauteurJournee =
		obtenirHauteurJournee(i);

	    const hauteurTotaleJournee =
		hauteurJournee * 2;

	    if (
		espaceUtilise + hauteurTotaleJournee >
		espaceDisponible
	    ) {
		break;
	    }

	    espaceUtilise += hauteurTotaleJournee;
	    nombre++;

	}

	return Math.min(
	    nombre,
	    journeesRestantes
	);

    }


    // --------------------------------------------------------
    // INDICATEUR À LA FIN DE LA PAGE
    // --------------------------------------------------------

    
    function dessinerIndicateurSuiteFin() {

	pdf.setFont(
	    "helvetica",
	    "italic"
	);

	pdf.setFontSize(
	    8
	);

  	pdf.setTextColor(
	    90,
	    90,
	    90
	);

    	pdf.text(
	    "Suite à la page suivante",
	    marge + largeur - 8,
	    y + 3.5,
	    { 
	    	align: "right"
	    }
	);


	y += hauteurIndicateurSuite;

	pdf.setTextColor(
	    ...couleurTexte
	);

	pdf.setFont(
	    "helvetica",
	    "normal"
	);

    }


    // --------------------------------------------------------
    // INDICATEUR AU DÉBUT DE LA PAGE
    // --------------------------------------------------------


    function dessinerIndicateurSuiteDebut(
	premiere,
	derniere
    ) {

	pdf.setFont(
	    "helvetica",
	    "italic"
	);

	pdf.setFontSize(
	    8
	);

  	pdf.setTextColor(
	    90,
	    90,
	    90
	);

	pdf.text(
	   `Suite des journées - jours ${premiere} à ${derniere}`,
	    marge + largeur / 2,
	    y + 3.5,
	    {
		align: "center"
	    }
	);

	y += hauteurIndicateurSuite;

	pdf.setTextColor(
	    ...couleurTexte
	);

	pdf.setFont(
	    "helvetica",
	    "normal"
	);

    }


    // --------------------------------------------------------
    // HAUTEUR COMMUNE DES LIGNES D'UNE JOURNÉE
    // --------------------------------------------------------

    function obtenirHauteurJournee(i) {

	const conteneurTransportsPublics =
	    document.getElementById(
		"conteneurTransportsPublics" + i
	    );

	if (!conteneurTransportsPublics) {
	    return 4.5;
	}

	const lignesTransports =
	    conteneurTransportsPublics.querySelectorAll(
		".transport-public-ligne"
	    );

	const codesTransports = {
	    "Autobus": 1,
	    "Avion": 2,
	    "Taxi": 3,
	    "Train": 4,
	    "Transport en commun municipal": 5,
	    "Traversier": 6
	};

	let nombreTransportsValides = 0;

	lignesTransports.forEach(function(ligne) {

	    const type =
		ligne.querySelector(
		    "select[id^='typeTransportPublic']"
		)?.value || "";

	    const champMontant =
		ligne.querySelector(
		    "input[id^='montantTransportPublic']"
		);

	    const montant =
		montantEnNombre(
		    champMontant?.value
		);

	    if (
		type &&
		codesTransports[type] &&
		montant > 0
	    ) {
		nombreTransportsValides++;
	    }

	});

	return Math.max(
	    4.5,
	    nombreTransportsValides * 4.5
	);

    }


    // --------------------------------------------------------
    // DESSIN D'UNE JOURNÉE - ACTIVITÉS
    // --------------------------------------------------------

    function dessinerJourneeTransports(i) {

	const dateJournee =
	    obtenirDateJournee(i);


	const parametres =
	    obtenirParametresPourJournee(i);


    	const transit =
	    obtenirNombre(
		"deplacementTransit" + i
	    );


	const locaux = 
	    obtenirNombre(
		"deplacementsLocaux" + i
	    );


	const montantKilometrage =
	    (transit + locaux) *
	    parametres.tauxKilometrage;


	const location =
	    obtenirNombre(
		"locationCout" + i
	    );


	const essence =
	    obtenirNombre(
		"locationEssence" + i
	    );


	const transportsPublics = [];

	const conteneurTransportsPublics =
	    document.getElementById(
		"conteneurTransportsPublics" + i
	    );

	if (conteneurTransportsPublics) {

	    const lignesTransports =
		conteneurTransportsPublics.querySelectorAll(
		    ".transport-public-ligne"
		);

	    const codesTransports = {
		"Autobus": 1,
		"Avion": 2,
		"Taxi": 3,
		"Train": 4,
		"Transport en commun municipal": 5,
		"Traversier": 6
	    };

	    lignesTransports.forEach(function(ligne) {

		const type =
		    ligne.querySelector(
			"select[id^='typeTransportPublic']"
		    )?.value || "";

		const champMontant =
		    ligne.querySelector(
			"input[id^='montantTransportPublic']"
		    );

		const montant =
		    montantEnNombre(
			champMontant?.value
		    );

		if (type && codesTransports[type] && montant > 0) {

		    transportsPublics.push({
			code: codesTransports[type],
			montant: montant
		    });

		}

	    });

	}

	
	const texteTransportsPublics = transportsPublics
	    .map(function(transport) {
		return transport.code + "- " + montantPDF(transport.montant);
	    })
	    .join("\n");


	const villeDepartJournee =
	    obtenirValeur(
		"villeDepart" + i
	    );


	const villeArriveeJournee =
	    obtenirValeur(
		"villeArrivee" + i
	    );


	const valeursTransports = [

	    i,

	    formaterDateCourte(
		dateJournee
	    ),

	    villeDepartJournee,

	    villeArriveeJournee,

	    transit
		? transit
		    .toFixed(2)
		    .replace(".", ",")
		: "—",

	    locaux
		? locaux
		    .toFixed(2)
		    .replace(".", ",")
		: "—",

	    montantKilometrage
		? montantPDF(montantKilometrage)
		: "—",

	    location
		? montantPDF(location)
		: "—",

	    essence
		? montantPDF(essence)
		: "—",

	    texteTransportsPublics || "—"

	];

	x = marge;

	const hauteurLigneBase = 
	    obtenirHauteurJournee(i);


	valeursTransports.forEach(
	    function(valeur, index) {

	    if (index === 9 && transportsPublics.length > 0) {

		const xCellule = x;
		const largeurCellule = largeursTransports[index];

		pdf.setDrawColor(...couleurBordure);

		pdf.rect(
		    xCellule,
		    y,
		    largeurCellule,
		    hauteurLigneBase
		);

		transportsPublics.forEach(function(transport, numero) {

		    const yTransport =
			y +
			numero * (hauteurLigneBase / transportsPublics.length);

		    pdf.setFont("helvetica", "normal");
		    pdf.setFontSize(7.5);
		    pdf.setTextColor(...couleurTexte);

		    pdf.text(
			transport.code + ".",
			xCellule + 1.5,
			yTransport + hauteurLigneBase / transportsPublics.length / 2 + 1
		    );

		    pdf.text(
			montantPDF(transport.montant),
			xCellule + largeurCellule - 1.5,
			yTransport + hauteurLigneBase / transportsPublics.length / 2 + 1,
			{ align: "right" }
		    );
		});

		x += largeurCellule;

		return;
	    }

		cellule(
		    x,
		    largeursTransports[index],
		    hauteurLigneBase,
		    valeur,
		    {
			alignement: 
			    index <= 1
				? "center"
				: index <= 3
				    ? "left"
				    : "right",
			taille: 7.5
		    }
		);


		x += largeursTransports[index];

	    }
	);


	y += hauteurLigneBase;

	}



    // --------------------------------------------------------
    // DESSIN D'UNE JOURNÉE - FRAIS
    // --------------------------------------------------------

    function dessinerJourneeDepenses(i, hauteurLigne = 4.5) {

	const parametres =
	    obtenirParametresPourJournee(i);

	const dejeuner =
	    obtenirCoche(
		"dejeuner" + i
	    )
		? parametres.dejeuner
		: 0;


	const diner =
	    obtenirCoche(
		"diner" + i
	    )
		? parametres.diner
		: 0;


	const souper =
	    obtenirCoche(
		"souper" + i
	    )
		? parametres.souper
		: 0;


	const collation =
	    obtenirCoche(
		"collation" + i
	    )
		? parametres.collation
		: 0;


	const hotel =
	    obtenirNombre(
		"hotel" + i
	    );


	const hotelChoix =
	    obtenirCoche(
		"hotelChoix" + i
	    );


	const proches =
	    obtenirCoche(
		"proches" + i
	    );


	const stationnement =
	    obtenirNombre(
		"stationnement" + i
	    );


	const divers =
	    obtenirNombre(
		"divers" + i
	    );


	const justification =
	    obtenirValeur(
		"justification" + i
	    );


	const hotelAffichage =
	    hotelChoix
		? montantPDF(hotel)
		: "—";


	const prochesAffichage =
	    proches
		? montantPDF(
		    parametres.proches
		)
		: "—";


	const valeursDepenses = [

	    i,

	    dejeuner
		? montantPDF(dejeuner)
		: "—",

	    diner
		? montantPDF(diner)
		: "—",

	    souper
		? montantPDF(souper)
		: "—",

	    collation
		? montantPDF(collation)
		: "—",

	    hotelAffichage,

	    prochesAffichage,

	    stationnement
		? montantPDF(stationnement)
		: "—",

	    divers
		? montantPDF(divers)
		: "—",

	    justification || "—"

    	];

	x = marge;


	valeursDepenses.forEach(
	    function(valeur, index) {

		cellule(
		    x,
		    largeursDepenses[index],
		    hauteurLigne,
		    valeur,
		    {
			alignement:
			    index === 0
				? "center"
				: 
			    index === 9
				? "left"
				: "right",
			taille: 7.5
		    }
		);


		x += 
		    largeursDepenses[index];

	    }
	);


	y += hauteurLigne;
    	}


    // --------------------------------------------------------
    // PAGINATION COMMUNE
    // --------------------------------------------------------

    let premiereJournee =
	1;

    let afficherIndicateurDebut =
	false;


    while (
	premiereJournee <=
	nombreJournees
    ) {

	const restantes =
	    nombreJournees - premiereJournee + 1;

	const hauteurDebut =
	    afficherIndicateurDebut
		? hauteurIndicateurSuite
		: 0;

	let nombreSurCettePage =
	    obtenirNombreJourneesParPage(
		hauteurDebut,
		false,
		restantes
	    );

	if (nombreSurCettePage >= restantes) {

	    const nombreAvecLegende = 
		obtenirNombreJourneesParPage(
		    hauteurDebut,
		    false,
		    restantes,
		    5
		);

	    if (nombreAvecLegende >= restantes) {

		nombreSurCettePage = nombreAvecLegende;

	    } else {

		nombreSurCettePage =
		    obtenirNombreJourneesParPage(
			hauteurDebut,
			true,
			restantes
		    );
	    }

	} else {

	    nombreSurCettePage =
		obtenirNombreJourneesParPage(
		    hauteurDebut,
		    true,
		    restantes
	  	);
	}

	if (nombreSurCettePage === 0) {
	    await nouvellePagePDF();

	    afficherIndicateurDebut = true;

	    continue;
	}

	const derniereJournee =
	    Math.min(
		premiereJournee + nombreSurCettePage - 1,
		nombreJournees
	    );

	if (
	    afficherIndicateurDebut
	) {

	    dessinerIndicateurSuiteDebut(
		premiereJournee,
		derniereJournee
	    );

	    afficherIndicateurDebut = false;
	}


	// ----------------------------------------------------
	// ACTIVITÉS ET TRANSPORTS
	// ----------------------------------------------------

	titreSection(
	    "ACTIVITÉS ET TRANSPORTS"
	);


	dessinerEnteteTransports();


	for (
	    let i = premiereJournee;
	    i <= derniereJournee;
	    i++
	) {

	    dessinerJourneeTransports(i);

	}

	if (derniereJournee === nombreJournees) {

	    pdf.setFont("helvetica", "normal");
	    pdf.setFontSize(7);
	    pdf.setTextColor(...couleurTexte);

	    const elementsLegende = [
		"Légende : 1. Autobus",
		"2. Avion",
		"3. Taxi",
		"4. Train",
		"5. Transport en commun municipal",
		"6. Traversier"
	    ];

	    let positionLegendeX = marge;

	    const positionLegendeY = y + 3.2;

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


	    y += 5;

	}

	y += 4;


	// ----------------------------------------------------
	// FRAIS DE SÉJOUR ET AUTRES DÉPENSES
	// ----------------------------------------------------

	titreSection(
	    "FRAIS DE SÉJOUR ET AUTRES DÉPENSES"
	);

	dessinerEntetesDepenses();

	for (
	    let i = premiereJournee;
	    i <= derniereJournee;
	    i++
	) {

	    dessinerJourneeDepenses(
		i
	    );

	}

	y += 4;


	// ----------------------------------------------------
	// PROCHAINE PAGE
	// ----------------------------------------------------

	premiereJournee =
	    derniereJournee + 1;


	if (
	    premiereJournee <=
	    nombreJournees
	) {

	    dessinerIndicateurSuiteFin();

	    await nouvellePagePDF();

	    afficherIndicateurDebut = true;

	}

    }


    // ========================================================
    // PIÈCES JUSTIFICATIVES
    // ========================================================

    if (fichiers.length === 0) {

        await verifierEspacePDF(13);

        titreSection(
            "PIÈCES JUSTIFICATIVES"
        );

        cellule(
            marge,
            largeur,
            6,
            "Aucune pièce justificative.",
            {
                taille: 7.5
            }
        );

        y += 6;

    } else {

        const largeurColonne =
            largeur / 2;

        // ----------------------------------------------------
        // EN-TÊTE DU TABLEAU
        // ----------------------------------------------------

        function dessinerEntetePieces() {

            cellule(
                marge,
                largeur,
                5,
                "Fichiers",
                {
                    fond: couleurEntete,
                    gras: true,
                    alignement: "center",
                    taille: 8
                }
            );

            y += 5;

        }

        // ----------------------------------------------------
        // DESSIN D'UNE PIÈCE
        // ----------------------------------------------------

        function dessinerNomPiece(
            positionX,
            nomFichier
        ) {

            const margeInterne = 2;
            const tailleInitiale = 7.5;
            const tailleMinimale = 5;

            let taillePolice = tailleInitiale;

            const texte =
                nomFichier.trim() === ""
                    ? ""
                    : nomFichier;

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(
                taillePolice
            );

            const largeurDisponible =
                largeurColonne - margeInterne * 2;

            while (
                texte !== "" &&
                pdf.getTextWidth(texte) > largeurDisponible &&
                taillePolice > tailleMinimale
            ) {

                taillePolice = Math.max(
                    tailleMinimale,
                    taillePolice - 0.25
                );

                pdf.setFontSize(
                    taillePolice
                );

            }

	    if (texte.trim() === "") {

		pdf.setDrawColor(
		    ...couleurBordure
		);

	    pdf.rect(
		positionX,
		y,
		largeurColonne,
		4.5
	    );

	} else {

	    cellule(
                positionX,
                largeurColonne,
                4.5,
                texte,
                {
                    taille: taillePolice
                }
            );

        }
	}

        // ----------------------------------------------------
        // DESSIN DU TABLEAU
        // ----------------------------------------------------

        await verifierEspacePDF(11.5);

        titreSection(
            "PIÈCES JUSTIFICATIVES"
        );

        dessinerEntetePieces();

        for (
            let i = 0;
            i < fichiers.length;
            i += 2
        ) {

            const nouvellePage =
                await verifierEspacePDF(6);

            if (nouvellePage) {

                titreSection(
                    "PIÈCES JUSTIFICATIVES"
                );

                dessinerEntetePieces();

            }

            // ------------------------------------------------
            // PREMIÈRE PIÈCE
            // ------------------------------------------------

            dessinerNomPiece(
                marge,
                fichiers[i].name
            );

            // ------------------------------------------------
            // DEUXIÈME PIÈCE OU CELLULE VIDE
            // ------------------------------------------------

            dessinerNomPiece(
                marge + largeurColonne,
                i + 1 < fichiers.length
                    ? fichiers[i + 1].name
                    : "\u00A0"
            );

            y += 4.5;

        }

    }

    y += 4;



    // ========================================================
    // TOTAL DU RAPPORT + RÉSERVÉ À L'ADMINISTRATION
    // ========================================================


    const hauteurAdministration = 48;

    const hauteurTotal = 6 + 9 + 16;

    const espaceEntreTotalEtAdministration = 4;

    const positionAdministration =
	hauteurPage -
	marge -
	hauteurAdministration;


    if (
	y +
	hauteurTotal +
	espaceEntreTotalEtAdministration >
	positionAdministration
    ) {
	await nouvellePagePDF();

    }


// ========================================================
// TOTAL DU RAPPORT
// ========================================================


    titreSection(
	"TOTAL DU RAPPORT"
    );


    const largeursTotaux = [
	largeur * 0.125,
	largeur * 0.125,
	largeur * 0.125,
	largeur * 0.125,
	largeur * 0.125,
	largeur * 0.125,
	largeur * 0.25
    ];


    const entetesTotaux = [
	"Kilométrage",
	"Location",
	"Transports\npublics",
	"Repas",
	"Hébergement",
	"Autres dépenses",
	"TOTAL GÉNÉRAL"
    ];


    x = marge;


    entetesTotaux.forEach(
	function(entete, index) {

	    cellule(
		x,
		largeursTotaux[index],
		9,
		entete,
		{
		    fond:
			index === 6
			    ? couleurTitre
			    : couleurEntete,
		    gras: true,
		    alignement: "center",
		    taille: 8,
		    couleurTexte:
			index === 6
			    ? [255, 255, 255]
			    : couleurTexte
		}
 	    );

	    x += 
		largeursTotaux[index];

	}
    );

    y += 9;


console.log("Total kilométrage :", document.getElementById("totalRapportKilometrage")?.textContent);
console.log("Total location :", document.getElementById("totalRapportLocation")?.textContent);
console.log("Total repas :", document.getElementById("totalRapportRepas")?.textContent);
console.log("Total général :", document.getElementById("totalRapportGeneral")?.textContent);

console.log(
    "Conversion PDF — kilométrage :",
    obtenirNombre("totalRapportKilometrage"),
    "| total général :",
    obtenirNombre("totalRapportGeneral")
);


    const valeursTotaux = [
	montantPDF(
	    obtenirNombre(
		"totalRapportKilometrage")
	),
	montantPDF(
	    obtenirNombre(
		"totalRapportLocation")
	),
	montantPDF(
	    obtenirNombre(
		"totalRapportTransportsPublics")
	),
	montantPDF(
	    obtenirNombre(
		"totalRapportRepas")
	),
	montantPDF(
	    obtenirNombre(
		"totalRapportHebergement")
	),
	montantPDF(
	    obtenirNombre(
		"totalRapportAutresDepenses")
	),
	montantPDF(
	    obtenirNombre(
		"totalRapportGeneral")
	)
    ];

console.log("Valeurs transmises au tableau 6 :", valeursTotaux);


    x = marge;

    valeursTotaux.forEach(
	function(valeur, index) {

	    cellule(
		x,
		largeursTotaux[index],
		6,
		valeur,
		{
		    fond: 
			index === 6
			    ? [248, 249, 250]
			    : null,
		    gras: 
			index === 6,
		    alignement: "right",
		    taille:
			index === 6
			    ? 10
			    : 7.5
		}
	    );

	    x += largeursTotaux[index];

	}

    );


    y += 16;


    // ========================================================
    // RÉSERVÉ À L'ADMINISTRATION
    // ANCRÉ AU BAS DE LA PAGE
    // ========================================================


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


// --------------------------------------------------------
// EN-TÊTE ADMINISTRATION
// --------------------------------------------------------


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


// --------------------------------------------------------
// LIGNES ADMINISTRATION
// --------------------------------------------------------


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


// --------------------------------------------------------
// AUTORISATION
// --------------------------------------------------------


    pdf.setLineWidth(
	0.2
    );

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


    /* Doublie barre supérieure */


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
	"Date :",
	marge +
	largeur * 0.67 +
	2,
	ligneAdministration + 5
    );



    // ========================================================
    // NUMÉRO DE PAGE
    // ========================================================


    const nombreTotalPages =
	pdf.getNumberOfPages();


    for (
	let page = 1;
	page <= nombreTotalPages;
	page++
    ) {

	pdf.setPage(
	    page
	);


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
	    "Page " + page,
	    largeurPage - marge,
	    hauteurPage - 3,
	    {
	    	align: "right"
	    }
    	);

    }


    return pdf;

}


// ========================================================
// TITRE ADMINISTRATION
// ========================================================


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


// ============================================================
// BOUTON « ENREGISTRER EN PDF »
// ============================================================

document.getElementById(
    "boutonGenererPDF"
)
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