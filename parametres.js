/*
    PARAMÈTRES DU RAPPORT DE DÉPLACEMENTS

    Ce fichier contient les paramètres financiers utilisés
    pour calculer les remboursements.

    Les paramètres sont regroupés par année civile.

    Pour ajouter une nouvelle année, copier la structure
    d'une année existante et modifier les montants.

    IMPORTANT :
    - tauxKilometrage = montant remboursé par kilomètre
    - dejeuner = montant maximal pour le déjeuner
    - diner = montant maximal pour le dîner
    - souper = montant maximal pour le souper
    - collation = montant maximal pour la collation
    - proches = montant pour une nuit chez des proches

    Le formulaire sélectionne automatiquement les paramètres
    correspondant à l'année de chaque journée du déplacement.
*/


// ============================================================
// PARAMÈTRES FINANCIERS PAR ANNÉE
// ============================================================

const donneesParametres = {
    "2026": {
        "tauxKilometrage": 0.68,
        "dejeuner": 22.05,
        "diner": 35.65,
        "souper": 46,
        "collation": 5,
        "proches": 40
    },
    "2027": {
        "tauxKilometrage": 0.99,
        "dejeuner": 30,
        "diner": 50,
        "souper": 60,
        "collation": 10,
        "proches": 75
    }
};


// ============================================================
// OBTENIR LES PARAMÈTRES D'UNE JOURNÉE
// ============================================================

function obtenirParametresPourJournee(numero) {

    const dateDepart =
        document.getElementById("dateDepart");

    if (
        !dateDepart ||
        !dateDepart.value
    ) {
        return null;
    }

    const date =
        new Date(
            dateDepart.value + "T00:00:00"
        );

    date.setDate(
        date.getDate() + numero - 1
    );

    const annee =
        date.getFullYear();

    return donneesParametres[annee];
}