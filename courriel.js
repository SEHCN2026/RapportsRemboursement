// ============================================================
// GESTION DU COURRIEL
// ============================================================


// ============================================================
// PARAMÈTRES DU COURRIEL
// ============================================================

const parametresCourriel = {

    destinataireInterne: 
	"info@sehcn.com",

    objet: 
	"Rapport de déplacements — [Nom] — [DateRapport] — [NatureActivite]",

    texte: 
	`Bonjour Marie,

Voici mon rapport de déplacements concernant l'activité suivante :

[NatureActivite]

Si requis, les factures et coupons de caisse originaux requis seront transmis séparément, par la poste, par courrier interne ou en personne.

Merci,

[Nom]`

};


// ============================================================
// ADRESSE POWER AUTOMATE
// ============================================================

const adressePowerAutomate = 
    "https://rapport-deplacements.xavier-37f.workers.dev";


// ============================================================
// REMPLACEMENT DES CODES
// ============================================================

function remplacerCodesCourriel() {

    const nom =
        document.getElementById(
	    "nom"
	).value.trim();

    const courriel = 
	document.getElementById(
	    "courriel"
 	).value.trim();

    const champNatureActivite =
	document.getElementById("motifActivite");

    const natureActivite = champNatureActivite
	? champNatureActivite.value.trim()
	: "Achats et dépenses";

    const champTotalAchats =
	document.getElementById("totalAchats");

    const totalAchats = champTotalAchats
	? champTotalAchats.textContent.trim()
	: "";

    const dateRapport =
        new Date().toLocaleDateString(
            "fr-CA"
        );

    const numeroRapport =
        "À attribuer";


    const estFormulaireC =
	document.getElementById("totalAchats") !== null;

    const objetModale = estFormulaireC
	? "Rapport de dépenses — [Nom] — [DateRapport]"
	: parametresCourriel.objet;

    const texteModale = estFormulaireC
	? `Bonjour Marie,

Voici mon rapport de dépenses concernant des achats effectués.

Les pièces justificatives requises sont jointes à ce courriel et les originaux seront acheminés prochainement.

Merci,

[Nom]`
	: parametresCourriel.texte;


    let objet = objetModale;
    let texte = texteModale;




    // --------------------------------------------------------
    // OBJET
    // --------------------------------------------------------


    objet =
        objet.replace(
            /\[Nom\]/g,
            nom
        );

    objet =
        objet.replace(
            /\[DateRapport\]/g,
            dateRapport
        );

    objet =
        objet.replace(
            /\[NatureActivite\]/g,
            natureActivite
        );

    objet =
        objet.replace(
            /\[NumeroRapport\]/g,
            numeroRapport
        );

    // --------------------------------------------------------
    // TEXTE
    // --------------------------------------------------------


    texte =
        texte.replace(
            /\[Nom\]/g,
            nom
        );

    texte =
        texte.replace(
            /\[DateRapport\]/g,
            dateRapport
        );

    texte =
        texte.replace(
            /\[NatureActivite\]/g,
            natureActivite
        );

    texte =
        texte.replace(
            /\[NumeroRapport\]/g,
            numeroRapport
        );

    texte =
	texte.replace(
	    /\[TotalAchats\]/g,
	    totalAchats
	);


    return {
	destinataire: courriel,        
	objet: objet,
        texte: texte
    };

}


// ============================================================
// CONVERSION D'UN FICHIER EN BASE64
// ============================================================

function fichierEnBase64(fichier) {

    return new Promise(
        function(resolve, reject) {

            const lecteur =
                new FileReader();

            lecteur.onload =
                function() {

                    const resultat =
                        lecteur.result;

                    const base64 =
                        resultat.split(",")[1];

                    resolve(base64);

                };

            lecteur.onerror =
                function() {

                    reject(
                        lecteur.error
                    );

                };

            lecteur.readAsDataURL(fichier);

        }
    );

}


// ============================================================
// PRÉPARATION DES PIÈCES JUSTIFICATIVES
// ============================================================

async function preparerPiecesJustificatives() {

    const champ =
        document.getElementById(
            "piecesJustificatives"
        );

    if (!champ) {
	return [];
    }

    const estFormulaireC =
	Array.isArray(champ._fichiersSelectionnes);

    const fichiers = estFormulaireC
	? champ._fichiersSelectionnes.map(function(element) {
	    return {
		fichier: element.fichier,
		numeroAchat: element.numeroAchat
	    };
	})
	: Array.from(champ.files).map(function(fichier) {
	    return {
		fichier: fichier,
		numeroAchat: null
	    };
	});

    const pieces = [];

    for (const element of fichiers) {

	const fichier = element.fichier;

	const contenu = await fichierEnBase64(fichier);

	const piece = {
	    nom: fichier.name,
	    type: fichier.type,
	    contenu: contenu
	};

	if (estFormulaireC) {
	    piece.numeroAchat = element.numeroAchat;
	}

	pieces.push(piece);
    }

    return pieces;
}


// ============================================================
// ENVOI DU RAPPORT - A et B
// ============================================================

async function envoyerRapportParCourriel() {


    // --------------------------------------------------------
    // VÉRIFIER LA CONFIRMATION DES DOCUMENTS ORIGINAUX
    // --------------------------------------------------------


    const confirmationDocumentsOriginaux =
	document.getElementById(
	    "confirmationDocumentsOriginaux"
	);

    if (
	!confirmationDocumentsOriginaux ||
	!confirmationDocumentsOriginaux.checked
    ) {

	afficherErreur(
	    "Veuillez confirmer avoir pris connaissance de la consigne concernant la transmission des documents originaux avant d'envoyer votre rapport."
	);

	return;

    }


    // --------------------------------------------------------
    // VÉRIFIER LA CONFIGURATION DE L'ENVOI
    // --------------------------------------------------------

    if (!adressePowerAutomate) {

        alert(
            "L'envoi par courriel n'est pas encore configuré. " +
            "Le branchement à Power Automate sera effectué à l'étape suivante."
        );

        return;

    }


    const parametres =
        remplacerCodesCourriel();


    const pdf =
        await genererPDF();


    if (!pdf) {

        return;

    }


    const pdfBase64 =
        pdf.output(
	    "datauristring"
	).split(",")[1];


    const pieces =
        await preparerPiecesJustificatives();


    const donnees = {

	destinataireInterne:
	    parametresCourriel.destinataireInterne,       

	destinataire:
            parametres.destinataire,

        objet:
            parametres.objet,

        texte:
            parametres.texte,

        pdf: {

            nom: document.getElementById("totalAchats")
                ? "Formulaire_de_demande_de_remboursement.pdf"
		: "Rapport_de_deplacements.pdf",

            type:
                "application/pdf",

            contenu:
                pdfBase64

        },

        piecesJustificatives:
            pieces

    };


    try {

        const reponse =
            await fetch(
                adressePowerAutomate,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            donnees
                        )

                }
            );


        if (!reponse.ok) {

            throw new Error(
                "Erreur lors de l'envoi."
            );

        }

	afficherSucces();


    }
    catch (erreur) {

        console.error(
            erreur
        );

        alert(
            "Une erreur est survenue lors de l'envoi du rapport."
        );

    }

}


// ============================================================
// BOUTON « ENVOYER PAR COURRIEL » A ET B
// ============================================================

document.getElementById(
    "boutonEnvoyerCourriel"
)
.addEventListener(
    "click",
    envoyerRapportParCourriel
);