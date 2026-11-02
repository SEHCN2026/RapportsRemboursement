/* ==================================================
   CONFIGURATION
================================================== */

const liensFormulaires = {
    A: "FormulaireA_Hébergements/index.html",
    B: "FormulaireB_AllerRetour/index.html",
    C: "FormulaireC_Remboursement/index.html"
};


/* ==================================================
   BIBLIOTHÈQUE D'ICÔNES
================================================== */

function creerIcone(nom) {

    const icones = {

        achats: `
            <svg class="icone-svg" viewBox="0 0 24 24"
                 aria-hidden="true">
                <path d="M5 8h14l1 12H4L5 8Z"/>
                <path d="M9 9V6a3 3 0 0 1 6 0v3"/>
                <path d="M9 13h.01M15 13h.01"/>
            </svg>`,

        calendrier: `
            <svg class="icone-svg" viewBox="0 0 24 24"
                 aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2"/>
                <path d="M16 3v4M8 3v4M3 10h18"/>
                <path d="m9 15 2 2 4-4"/>
            </svg>`,

        voiture: `
            <svg class="icone-svg" viewBox="0 0 24 24"
                 aria-hidden="true">
                <path d="m5 11 2-5h10l2 5"/>
                <path d="M3 11h18v7H3z"/>
                <path d="M6 18v2M18 18v2"/>
                <path d="M6 14h.01M18 14h.01"/>
                <path d="M3 14H2M22 14h-1"/>
            </svg>`,

        itineraire: `
            <svg class="icone-svg" viewBox="0 0 24 24"
                 aria-hidden="true">
                <circle cx="6" cy="18" r="2.5"/>
                <circle cx="18" cy="6" r="2.5"/>
                <path d="M8.5 18H12a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/>
                <path d="m15 12 3-3 3 3"/>
            </svg>`,

        aide: `
            <svg class="icone-svg" viewBox="0 0 24 24"
                 aria-hidden="true">
                <circle cx="12" cy="12" r="9"/>
                <path d="M9.5 9a2.6 2.6 0 1 1 4.5 1.8c-1.2 1.1-2 1.5-2 3"/>
                <path d="M12 17h.01"/>
            </svg>`
    };
    
    return icones[nom] || "";

}


/* ==================================================
   ÉLÉMENTS DE LA PAGE
================================================== */

const contenuOrientation = document.getElementById(
    "contenu-orientation"
);

const resultatOrientation = document.getElementById(
    "resultat-orientation"
);

const boutonRetour = document.getElementById(
    "bouton-retour"
);

const boutonRecommencer = document.getElementById(
    "bouton-recommencer"
);

const progression = document.getElementById(
    "progression"
);


/* ==================================================
   ÉTAT DE L'ORIENTATION
================================================== */

let historiqueOrientation = [];
let questionActuelle = "achats-deplacement";


/* ==================================================
   CONTENU DES QUESTIONS
================================================== */

const questionsOrientation = {

    "achats-deplacement": {
	numero: "QUESTION 1",
	progression: 1,

	titre: 
	    "Votre demande concerne-t-elle des achats ou un déplacement?",

	aide:
	    "Par exemple, des fournitures (incluant achats pour le fonds d'aide aux élèves dans le besoin), du matériel, les achats des délégués ou un déplacement professionnel.",

	choix: [
	    {
		valeur: "achats",
		icone: "achats",
		classe: "icone-achats",
		titre: "Des achats",
		description:
		    "J'ai acheté des articles, sans déplacement à déclarer."
	    },
	    {
		valeur: "deplacement",
   		icone: "itineraire",
		classe: "icone-deplacement",
		titre: "Un déplacement",
		description:
		    "Je dois déclarer un déplacement à être remboursé par le SEHCN."
	    }
	]
    },

    "coucher": {
	numero: "QUESTION 2",
	progression: 2,

	titre:
	    "Votre déplacement nécessite-t-il un coucher?",

	aide:
	    "Un coucher signifie que vous devez passer la nuit à l'extérieur dans le cadre du déplacement.",

	choix: [
	    {
		valeur: "oui",
		icone: "calendrier",
		classe: "icone-deplacement",
		titre: "Oui, un coucher est nécessaire",
		description:
		    "Mon déplacement comprend au moins deux jours et un coucher."
	    },
	    {
		valeur: "non",
		icone: "voiture",
		classe: "icone-achats",
		titre: "Non, aucun coucher",
		description:
		    "Je n'ai pas besoin de passer la nuit à l'extérieur."
	    }
	]
    },

    "aller-retour": {
	numero: "QUESTION 3",
	progression: 3,

	titre:
	    "Le déplacement est-il un aller-retour effectué dans la même journée?",

	aide:
	    "Il ne doit y avoir aucun coucher pendant le déplacement.",

	choix: [
	    {
		valeur: "oui",
		icone: "voiture",
		classe: "icone-deplacement",
		titre: "Oui, dans la même journée",
		description:
		    "Je pars et je reviens au cours de la même journée."
	    },
	    {
		valeur: "non",
		icone: "aide",
		classe: "icone-achats",
		titre: "Non, ma situation est différente",
		description:
		    "Mon déplacement s'étend sur plus d'une journée, sans coucher."
	    }
	]
    }
};


/* ==================================================
   AFFICHAGE DES QUESTIONS
================================================== */

function afficherQuestion(nomQuestion) {

    const question = questionsOrientation[nomQuestion];

    if (!question) {
	return;
    }

    questionActuelle = nomQuestion;

    resultatOrientation.hidden = true;
    contenuOrientation.hidden = false;

    contenuOrientation.innerHTML = `
	<p class="etiquette-question">
	    ${question.numero}
	</p>

	<h3>${question.titre}</h3>

	<p class="aide-question">
	    ${question.aide}
	</p>

	<div class="choix-orientation">
	    ${question.choix.map(choix => `
		<button
		    type="button"
		    class="bouton-choix"
		    data-reponse="${choix.valeur}">

		    <span
			class="icone-choix ${choix.classe}"
		 	aria-hidden="true">
			${creerIcone(choix.icone)}
		    </span>

		    <span class="texte-choix">
			<strong>${choix.titre}</strong>
			<small>${choix.description}</small>
		    </span>

		    <span class="fleche" aria-hidden="true"></span>
		</button>
	    `).join("")}
	</div>
    `;


    const etapesTotales = {
	"achats-deplacement": 2,
	"coucher": 3,
	"aller-retour": 4
    };


    mettreAJourProgression(
	question.progression,
	etapesTotales[nomQuestion]
    );

    mettreAJourBoutons();

    contenuOrientation
	.querySelectorAll("[data-reponse]")
	.forEach(bouton => {
	    bouton.addEventListener("click", () => {
		traiterReponse(bouton.dataset.reponse);
	    });
	});
}


/* ==================================================
   BARRE DE PROGRESSION DYNAMIQUE
================================================== */

function mettreAJourProgression(etapeActuelle, nombreEtapes) {

    progression.innerHTML = "";

    for (let i = 1; i <= nombreEtapes; i++) {

	const segment = document.createElement("span");

	segment.className = "etape";

	if (i <= etapeActuelle) {
	    segment.classList.add("active");
	}

	progression.appendChild(segment);
    }

    progression.setAttribute("aria-valuemax", nombreEtapes);
    progression.setAttribute("aria-valuenow", etapeActuelle);

}


/* ==================================================
   GESTION DES RÉPONSES
================================================== */

function traiterReponse(reponse) {

    historiqueOrientation.push(questionActuelle);

    switch (questionActuelle) {

	case "achats-deplacement":

	    if (reponse === "achats") {
		afficherResultat("C");
	    } else {
		afficherQuestion("coucher");
	    }

	    break;

	case "coucher":

	    if (reponse === "oui") {
		afficherResultat("A");
	    } else {
		afficherQuestion("aller-retour");
	    }

	    break;

	case "aller-retour":

	    if (reponse === "oui") {
		afficherResultat("B");
	    } else {
		afficherResultat("aide");
	    }

	    break;

    }

}


/* ==================================================
   AFFICHAGE DES RÉSULTATS
================================================== */

function afficherResultat(formulaire) {

    contenuOrientation.hidden = true;
    resultatOrientation.hidden = false;

    const progressionResultats = {
	A: 3,
	B: 4,
	C: 2,
	aide: 4
    };

    mettreAJourProgression(
	progressionResultats[formulaire],
	progressionResultats[formulaire]
    );

    mettreAJourBoutons();

    const resultats = {

	A: {
	    classe: "resultat-a",
	    icone: "calendrier",
	    titre: "Formulaire A — Rapport de déplacements",
	    description:
		"Ce formulaire convient à un déplacement d'au moins deux jours comprenant un coucher.",
	    bouton: "Accéder au formulaire A",
	    lien: liensFormulaires.A
	},

	B: {
	    classe: "resultat-b",
	    icone: "voiture",
	    titre: "Formulaire B — Rapport de déplacements",
	    description:
		"Ce formulaire convient à un déplacement avec aller-retour dans la même journée, sans coucher.",
	    bouton: "Accéder au formulaire B",
	    lien: liensFormulaires.B
	},

	C: {
	    classe: "resultat-c",
	    icone: "achats",
	    titre: "Formulaire C — Remboursement des achats",
	    description:
		"Ce formulaire convient au remboursement d'achats, sans déplacement à déclarer.",
	    bouton: "Accéder au formulaire C",
	    lien: liensFormulaires.C
	},

	aide: {
	    classe: "resultat-attention",
	    icone: "aide",
	    titre: "Votre situation nécessite une vérification",
	    description:
		"Votre déplacement s'étend sur plusieurs jours sans coucher. Comme cette situation ne correspond pas clairement aux critères des formulaires A et B, vérifiez auprès de la personne responsable des remboursements avant de poursuivre.",
	    bouton: null,
	    lien: null,
	    lienAide: true
	}
    };

    const resultat = resultats[formulaire];

    resultatOrientation.innerHTML = `
	<div class="resultat-entete">
	    <span
		class="icone-resultat"
		aria-hidden="true">
		${creerIcone(resultat.icone)}
	    </span>

	    <h3>${resultat.titre}</h3>
	</div>

	<p class="texte-resultat">
	    ${resultat.description}
	</p>

	${resultat.lien ? `
	    <a
		class="lien-resultat"
		href="${resultat.lien}">
	 	${resultat.bouton}
		<span aria-hidden="true">→</span>
	    </a>
	` : ""}

    	${resultat.lienAide ? `
	    <p>
		<a class="lien-vers-aide" href="#aide">
		    Consulter la section « Besoin d'aide »
		    <svg
			class="icone-sve fleche-vers-aide"
			viewBox="0 0 24 24"
 			aria-hidden="true">
			<path d="M12 5v14"/>
			<path d="m6 13 6 6 6-6"/>
		    </svg>
		</a>
	    </p>
	` : ""}
    `;

    resultatOrientation.focus?.();
}


/* ==================================================
   BOUTONS DE NAVIGATION
================================================== */

function mettreAJourBoutons() {

    boutonRetour.hidden =
	historiqueOrientation.length === 0;

    boutonRecommencer.hidden =
	historiqueOrientation.length === 0 &&
	!resultatOrientation.hidden;

}

boutonRetour.addEventListener("click", () => {

    if (historiqueOrientation.length === 0) {
	return;
    }

    const questionPrecedente = historiqueOrientation.pop();

    afficherQuestion(questionPrecedente);
});


boutonRecommencer.addEventListener("click", () => {

    historiqueOrientation = [];

    afficherQuestion("achats-deplacement");
});


/* ==================================================
   INITIALISATION
================================================== */

afficherQuestion("achats-deplacement");