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

    const justification =
	obtenirValeur("justificationAdditionnelle");


    /* ================================
       ACHATS
    ================================ */

    const achats = [];


    document.querySelectorAll(".ligne-achat").forEach(
	function(ligne, index) {

	    const numero =
		ligne.dataset.numero || String(index + 1);

	    const date = obtenirValeur(
		"dateAchat" + numero
	    );

	    const motif = obtenirValeur(
		"motifAchat" + numero
	    );

	    const precisionMotif = obtenirValeur(
		"precisionMotif" + numero
	    );

	    const description = obtenirValeur(
		"descriptionAchat" + numero
	    );

	    const coutTexte = obtenirValeur(
		"coutAchat" + numero
	    );


	    achats.push({
		numero: numero,
		date: formaterDate(date),
		motif: valeurOuTiret(motif),
		precisionMotif: precisionMotif.trim(),
		description: valeurOuTiret(description),
		cout: montantEnNombrePDF(coutTexte)
	    });

	}

    );


    const totalCalcule = achats.reduce(
	function(total, achat) {
	    return total + achat.cout;
	},
	0
    );



    /* ================================
       PIÈCES JUSTIFICATIVES
    ================================ */

    const pieces = [];

    document.querySelectorAll(
	"#listePiecesJustificatives .piece-justificative"
    ).forEach(function(piece) {

	const nomElement = 
	    piece.querySelector(".nom-fichier");

    	const achatElement =
	    piece.querySelector(".achat-piece");

	pieces.push({
	    nom: valeurOuTiret(
		nomElement
		    ? nomElement.textContent.trim()
		    : ""
	    ),

	    achat: valeurOuTiret(
		achatElement
		    ? achatElement.textContent.trim()
		    : ""
	    )
	});
    });



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
        "DEMANDE DE REMBOURSEMENT",
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
	"Formulaire de remboursement — achats divers",
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


    y += hauteurLigne + 8;


    /* ================================
       ACHATS
    ================================ */

    titreSection(
        "ACHATS"
    );


    const largeursAchats = [
        largeur * 0.07,
        largeur * 0.17,
	largeur * 0.17,
        largeur * 0.39,
        largeur * 0.20
    ];


    const entetesAchats = [
        "Item",
        "Date de l'achat",
	"Motif de l'achat",
        "Description de l'achat",
	"Coût de l'achat"
    ];


    /* --------------------------------
   	EN-TÊTES DU TABLEAU
    -------------------------------- */

    x = marge;


    entetesAchats.forEach(
        function(entete, index) {

            cellule(
                x,
                largeursAchats[index],
                9,
                entete,
                {
                    fond: couleurEntete,
                    gras: true,
                    alignement: "center",
                    taille: 7.5
                }
            );

            x +=
                largeursAchats[index];

        }
    );


    y += 9;

    /* --------------------------------
       LIGNES DES ACHATS
    -------------------------------- */

    achats.forEach(
	function(achat) {


    	    const valeursAchats = [
        	achat.numero,
        	valeurOuTiret(achat.date),
		valeurOuTiret(achat.motif),
        	valeurOuTiret(achat.description),
		montantPDF(achat.cout)
    	    ];


    	    x = marge;


    	    valeursAchats.forEach(
        	function(valeur, index) {

            	    cellule(
                	x,
                	largeursAchats[index],
                	7,
                	valeur,
                	{
                    	    alignement:
                        	index === 0
                            	    ? "center"
                            	    : index === 4
					? "right"
					: "left",
                    	    taille: 7
                	}
            	    );

            	    x +=
                	largeursAchats[index];

        	}
    	    );


    	    y += 7;


        /* --------------------------------
           PRÉCISION DU MOTIF « AUTRE »
        -------------------------------- */

	if (
	    achat.motif === "Autre" &&
	    achat.precisionMotif !== ""
	) {

	    const textePrecision =
		"Précision du motif : " +
		achat.precisionMotif;

	    const lignesPrecision =
		pdf.splitTextToSize(
		    textePrecision,
		    largeur - 6
		);

	    const hauteurPrecision =
		Math.max(
		    6,
		    lignesPrecision.length * 3.5 + 2
		);

	pdf.setFillColor(
	    248,
	    250,
	    252
	);

	pdf.setDrawColor(
	    ...couleurBordure
	);

	pdf.rect(
	    marge,
	    y,
	    largeur,
	    hauteurPrecision,
	    "FD"
	);

	pdf.setFont(
	    "helvetica",
	    "italic"
	);

	pdf.setFontSize(7);

	pdf.setTextColor(
	    ...couleurTexte
	);

	pdf.text(
	    lignesPrecision,
	    marge + 3,
	    y + hauteurPrecision / 2 -
	    	((lignesPrecision.length - 1) * 3.5) / 2 +
		1.2
	);

	y += hauteurPrecision;

	}

	}

    );

    // Total des achats

    pdf.setLineWidth(0.6);

    pdf.setDrawColor(
	...couleurBordure
    );

    pdf.line(
	marge,
	y,
	marge + largeur,
	y
    );

    pdf.setLineWidth(0.2);


    x = marge;

    const largeurTotalLibelle =
	largeursAchats.slice(0, 4).reduce(
	    function(total, valeur) {
		return total + valeur;
	    },
	    0
	);


    cellule(
	x,
	largeurTotalLibelle,
	8,
	"TOTAL DES ACHATS",
	{
	    gras: true,
	    alignement: "right",
	    taille: 8
	}
    );


    x += largeurTotalLibelle;


    cellule(
	x,
	largeursAchats[4],
	8,
	montantPDF(totalCalcule),
	{
	    gras: true,
	    alignement: "right",
	    taille: 8
	}
    );

    y += 8;

    y += 5;


    /* ================================
       PIÈCES JUSTIFICATIVES
    ================================ */

    if (
        pieces.length > 0
    ) {

	y += 5;

        titreSection(
            "PIÈCES JUSTIFICATIVES"
        );

	const largeursPieces = [
	    largeur * 0.65,
	    largeur * 0.35
	];

	const entetesPieces = [
	    "Fichier",
	    "Achat associé"
	];

	x = marge;


	entetesPieces.forEach(
	    function(entete, index) {

		cellule(
		    x,
	 	    largeursPieces[index],
		    7,
		    entete,
		    {
			fond: couleurEntete,
			gras: true,
			alignement: "center",
			taille: 8
		    }
		);

		x += largeursPieces[index];
	    }

	);

	y += 7;

	pieces.forEach(
	    function(piece) {

		const valeursPieces = [
		    piece.nom,
		    piece.achat
		];

		x = marge;

		valeursPieces.forEach(
		    function(valeur, index) {


			cellule(
			    x,
			    largeursPieces[index],
			    6,
			    valeur,
			    {
				taille: 7.5
			    }
			);

			x += largeursPieces[index];

		    }

		);

		y += 6;
	    }
	);
    }


    /* ================================
       JUSTIFICATION ADDITIONNELLE
    ================================ */


    if (justification.trim() !== "") {

	y += 5;

	titreSection(
	    "JUSTIFICATION ADDITIONNELLE"
	);

	pdf.setFont(
	    "helvetica",
	    "normal"
	);

	pdf.setFontSize(8);

	const lignesJustification =
	    pdf.splitTextToSize(
		justification,
		largeur - 4
	    );

	const hauteurJustification =
	    lignesJustification.length * 4;

	pdf.setDrawColor(
	    ...couleurBordure
	);

	pdf.rect(
	    marge,
	    y,
	    largeur,
	    hauteurJustification + 4
	);

	pdf.text(
	    lignesJustification,
	    marge + 2,
	    y + 4
	);

	y += hauteurJustification + 4;
    }


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
                "Demande_de_remboursement.pdf"
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