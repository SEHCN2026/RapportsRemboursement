// ============================================================
// DISTANCES ROUTIÈRES
// FORMULAIRE B
// ============================================================
//
// Le système fonctionne selon une ligne géographique continue.
//
// Certaines localités sont directement situées sur l'axe
// principal.
//
// D'autres localités sont accessibles par une branche routière
// à partir d'un point de raccordement situé sur l'axe.
//
// Le calcul final tient compte de cette structure.
//
// ============================================================


// ============================================================
// 1. LOCALITÉS ET LEUR POINT RELAIS
// ============================================================
//
// orientation :
//
// "EST"
//   Le relais est situé à l'est du groupe.
//
// "OUEST"
//   Le relais est situé à l'ouest du groupe.
//
// type :
//
// "AXE"
//   Localité située directement sur l'axe principal.
//
// "BRANCHE"
//   Localité accessible par une route secondaire.
//
// Pour une BRANCHE :
// - raccord = point de raccordement sur l'axe;
// - distance = distance routière entre le raccordement
//   et la localité.
//
// ============================================================

const distancesLocalites = {

    // ========================================================
    // GROUPE FORESTVILLE
    // Relais situé à l'EST
    // ========================================================

    "Chicoutimi": {
        type: "BRANCHE",
	raccord: "Intersection 138/172",
        distance: 123
    },

    "Tadoussac": {
        relais: "Forestville",
        distance: 97,
        orientation: "EST",
        type: "AXE"
    },

    "Intersection 138/172": {
	relais: "Forestville",
	distance: 91,
	orientation: "EST",
	type: "AXE"
    },

    "Sacré-Cœur": {
        type: "BRANCHE",
	raccord: "Intersection 138/172",
        distance: 11
    },

    "Les Bergeronnes": {
        relais: "Forestville",
        distance: 74,
        orientation: "EST",
        type: "AXE"
    },

    "Essipit": {
        relais: "Forestville",
        distance: 59,
        orientation: "EST",
        type: "AXE"
    },

    "Les Escoumins": {
        relais: "Forestville",
        distance: 58,
        orientation: "EST",
        type: "AXE"
    },

    "Longue-Rive": {
        relais: "Forestville",
        distance: 33,
        orientation: "EST",
        type: "AXE"
    },

    "Portneuf-sur-Mer": {
        relais: "Forestville",
        distance: 15,
        orientation: "EST",
        type: "AXE"
    },

    "Forestville": {
        relais: "Forestville",
        distance: 0,
        orientation: "EST",
        type: "AXE"
    },


    // ========================================================
    // GROUPE BAIE-COMEAU (MINGAN)
    // Relais situé à l'EST
    // ========================================================

    "Colombier": {
        relais: "Baie-Comeau (Mingan)",
        distance: 70,
        orientation: "EST",
        type: "AXE"
    },

    "Pessamit": {
        relais: "Baie-Comeau (Mingan)",
        distance: 48,
        orientation: "EST",
        type: "AXE"
    },

    "Ragueneau": {
        relais: "Baie-Comeau (Mingan)",
        distance: 24.1,
        orientation: "EST",
        type: "AXE"
    },

    "Chute-aux-Outardes": {
        relais: "Baie-Comeau (Mingan)",
        distance: 16.5,
        orientation: "EST",
        type: "AXE"
    },

    // --------------------------------------------------------
    // POINT DE RACCORDEMENT POINTE-AUX-OUTARDES
    // --------------------------------------------------------

    "Embranchement PAO": {
        relais: "Baie-Comeau (Mingan)",
        distance: 12.2,
        orientation: "EST",
        type: "AXE"
    },

    // --------------------------------------------------------
    // POINT DE RACCORDEMENT POINTE-LEBEL
    // --------------------------------------------------------

    "Carrefour giratoire PL": {
        relais: "Baie-Comeau (Mingan)",
        distance: 8,
        orientation: "EST",
        type: "AXE"
    },

    // --------------------------------------------------------
    // BAIE-COMEAU MINGAN
    // --------------------------------------------------------

    "Baie-Comeau (Mingan)": {
        relais: "Baie-Comeau (Mingan)",
        distance: 0,
        orientation: "EST",
        type: "AXE"
    },

    // --------------------------------------------------------
    // BRANCHE POINTE-AUX-OUTARDES
    // --------------------------------------------------------

    "Pointe-aux-Outardes": {
        type: "BRANCHE",
        raccord: "Embranchement PAO",
        distance: 9
    },

    // --------------------------------------------------------
    // BRANCHE POINTE-LEBEL
    // --------------------------------------------------------

    "Pointe-Lebel": {
        type: "BRANCHE",
        raccord: "Carrefour giratoire PL",
        distance: 7.2
    },


    // ========================================================
    // GROUPE BAIE-COMEAU (MARQUETTE)
    // Relais situé à l'OUEST
    // ========================================================

    "Baie-Comeau (Marquette)": {
        relais: "Baie-Comeau (Marquette)",
        distance: 0,
        orientation: "OUEST",
        type: "AXE"
    },

    "Baie-Comeau (St-Georges)": {
	relais: "Baie-Comeau (St-Georges)",
	distance: 0,
	orientation: "OUEST",
	type: "AXE"
    },

    "Franquelin": {
        relais: "Baie-Comeau (Marquette)",
        distance: 32.2,
        orientation: "OUEST",
        type: "AXE"
    },

    "Godbout": {
        relais: "Baie-Comeau (Marquette)",
        distance: 60.8,
        orientation: "OUEST",
        type: "AXE"
    },

    "Baie-Trinité": {
        relais: "Baie-Comeau (Marquette)",
        distance: 92.4,
        orientation: "OUEST",
        type: "AXE"
    },


    // ========================================================
    // SEPT-ÎLES
    // ========================================================

    "Sept-Îles": {
        relais: "Sept-Îles",
        distance: 0,
        orientation: "OUEST",
        type: "AXE"
    }

};


// ============================================================
// 2. DISTANCES ENTRE LES RELAIS
// ============================================================

const distancesRelais = {

    "Forestville|Baie-Comeau (Mingan)": 95,

    "Baie-Comeau (Mingan)|Baie-Comeau (Marquette)": 10,

    "Baie-Comeau (Marquette)|Sept-Îles": 229,

    "Baie-Comeau (Marquette)|Baie-Comeau (St-Georges)": 5

};


// ============================================================
// 3. LISTE DES VILLES
// ============================================================
//
// Les points de raccordement ne sont pas proposés dans les
// listes déroulantes. Ils servent uniquement au calcul interne.
//
// ============================================================

const villesDistances = [

    "Baie-Comeau (Marquette)",
    "Baie-Comeau (Mingan)",
    "Baie-Comeau (St-Georges)",
    "Baie-Trinité",
    "Chicoutimi",
    "Chute-aux-Outardes",
    "Colombier",
    "Essipit",
    "Forestville",
    "Franquelin",
    "Godbout",
    "Les Bergeronnes",
    "Les Escoumins",
    "Longue-Rive",
    "Pessamit",
    "Pointe-aux-Outardes",
    "Pointe-Lebel",
    "Portneuf-sur-Mer",
    "Ragueneau",
    "Sacré-Cœur",
    "Sept-Îles",
    "Tadoussac"

];


// ============================================================
// 4. CONSTRUCTION DE LA MATRICE DES RELAIS
// ============================================================

const relaisDistances = {};


// ------------------------------------------------------------
// Identifier les relais
// ------------------------------------------------------------

const relaisDisponibles = [
    ...new Set(
        Object.entries(distancesLocalites)
            .filter(function([ville, donnees]) {
                return donnees.type !== "BRANCHE";
            })
            .map(function([ville, donnees]) {
                return donnees.relais;
            })
    )
];


// ------------------------------------------------------------
// Initialiser la matrice
// ------------------------------------------------------------

relaisDisponibles.forEach(function(relais) {

    relaisDistances[relais] = {};

    relaisDisponibles.forEach(function(destination) {

        relaisDistances[relais][destination] =
            relais === destination
                ? 0
                : Infinity;

    });

});


// ------------------------------------------------------------
// Insérer les distances connues entre relais
// ------------------------------------------------------------

Object.entries(distancesRelais).forEach(
    function([cle, distance]) {

        const parties = cle.split("|");

        const origine = parties[0];
        const destination = parties[1];

        relaisDistances[origine][destination] =
            distance;

        relaisDistances[destination][origine] =
            distance;

    }
);


// ============================================================
// 5. COMPLÉTER AUTOMATIQUEMENT LE RÉSEAU DES RELAIS
// ============================================================

relaisDisponibles.forEach(function(intermediaire) {

    relaisDisponibles.forEach(function(origine) {

        relaisDisponibles.forEach(function(destination) {

            const distancePossible =
                relaisDistances[origine][intermediaire] +
                relaisDistances[intermediaire][destination];

            if (
                distancePossible <
                relaisDistances[origine][destination]
            ) {

                relaisDistances[origine][destination] =
                    distancePossible;

            }

        });

    });

});


// ============================================================
// 6. OBTENIR LA DISTANCE ENTRE DEUX RELAIS
// ============================================================

function obtenirDistanceEntreRelais(
    relaisOrigine,
    relaisDestination
) {

    if (
        !relaisDistances[relaisOrigine] ||
        !Number.isFinite(
            relaisDistances[relaisOrigine][relaisDestination]
        )
    ) {

        return Infinity;

    }

    return relaisDistances[
        relaisOrigine
    ][
        relaisDestination
    ];

}


// ============================================================
// 7. CALCULER LA POSITION DES RELAIS
// ============================================================
//
// Forestville                    = 0
// Baie-Comeau (Mingan)           = 95
// Baie-Comeau (Marquette)        = 105
// Sept-Îles                      = 334
//
// ============================================================

const positionsRelais = {};

positionsRelais["Forestville"] = 0;

positionsRelais["Baie-Comeau (Mingan)"] =
    positionsRelais["Forestville"] +
    95;

positionsRelais["Baie-Comeau (Marquette)"] =
    positionsRelais["Baie-Comeau (Mingan)"] +
    10;

positionsRelais["Baie-Comeau (St-Georges)"] =
    positionsRelais["Baie-Comeau (Marquette)"] +
    5;

positionsRelais["Sept-Îles"] =
    positionsRelais["Baie-Comeau (Marquette)"] +
    229;


// ============================================================
// 8. CALCULER LA POSITION DES LOCALITÉS SUR L'AXE
// ============================================================

const positionsLocalites = {};


// ------------------------------------------------------------
// Seules les localités situées directement sur l'axe sont
// converties en position géographique.
// ------------------------------------------------------------

Object.entries(distancesLocalites).forEach(
    function([ville, donnees]) {

        if (donnees.type === "BRANCHE") {
            return;
        }

        const positionRelais =
            positionsRelais[donnees.relais];


        if (typeof positionRelais !== "number") {
            return;
        }


        if (donnees.orientation === "EST") {

            positionsLocalites[ville] =
                positionRelais -
                donnees.distance;

        }

        else if (donnees.orientation === "OUEST") {

            positionsLocalites[ville] =
                positionRelais +
                donnees.distance;

        }

    }
);


// ============================================================
// 9. OBTENIR LA POSITION D'UNE LOCALITÉ
// ============================================================
//
// Pour une localité normale :
//     sa position est directement sur l'axe.
//
// Pour une branche :
//     sa position géographique sur l'axe est celle de son
//     point de raccordement.
//
// La distance de la branche est ensuite ajoutée au calcul.
//
// ============================================================

function obtenirPositionSurAxe(ville) {

    const donnees =
        distancesLocalites[ville];


    if (!donnees) {
        return null;
    }


    // --------------------------------------------------------
    // Localité directement sur l'axe
    // --------------------------------------------------------

    if (donnees.type !== "BRANCHE") {

        if (
            typeof positionsLocalites[ville] !== "number"
        ) {

            return null;

        }

        return positionsLocalites[ville];

    }


    // --------------------------------------------------------
    // Localité en branche
    // --------------------------------------------------------

    const raccord =
        donnees.raccord;


    if (
        typeof positionsLocalites[raccord] !== "number"
    ) {

        return null;

    }


    return positionsLocalites[raccord];

}


// ============================================================
// 10. CALCULER LA DISTANCE D'UNE LOCALITÉ À L'AXE
// ============================================================

function obtenirDistanceBranche(ville) {

    const donnees =
        distancesLocalites[ville];


    if (
        !donnees ||
        donnees.type !== "BRANCHE"
    ) {

        return 0;

    }


    return donnees.distance;

}


// ============================================================
// 11. FONCTION PRINCIPALE DE CALCUL
// ============================================================
//
// Pour deux localités situées directement sur l'axe :
//
//     différence entre leurs positions.
//
// Pour une localité en branche :
//
//     distance de la branche
//     +
//     distance entre son raccordement et l'autre point.
//
// Pour deux branches :
//
//     distance de la première branche
//     +
//     distance entre les deux raccordements
//     +
//     distance de la deuxième branche.
//
// ============================================================

function calculerDistance(
    origine,
    destination
) {

    // --------------------------------------------------------
    // Exception Chicoutimi / Sacré-Coeur
    // --------------------------------------------------------

    if(
	(origine === "Chicoutimi" && destination === "Sacré-Cœur") ||
	(origine === "Sacré-Cœur" && destination === "Chicoutimi")
    ) {
	return 112;
    }

    // --------------------------------------------------------
    // Vérifier que l'origine existe
    // --------------------------------------------------------

    if (
        !Object.prototype.hasOwnProperty.call(
            distancesLocalites,
            origine
        )
    ) {

        return null;

    }


    // --------------------------------------------------------
    // Vérifier que la destination existe
    // --------------------------------------------------------

    if (
        !Object.prototype.hasOwnProperty.call(
            distancesLocalites,
            destination
        )
    ) {

        return null;

    }


    // --------------------------------------------------------
    // Même ville
    // --------------------------------------------------------

    if (origine === destination) {
        return 0;
    }


    const donneesOrigine =
        distancesLocalites[origine];

    const donneesDestination =
        distancesLocalites[destination];


    const origineEstBranche =
        donneesOrigine.type === "BRANCHE";

    const destinationEstBranche =
        donneesDestination.type === "BRANCHE";


    // --------------------------------------------------------
    // Position sur l'axe de l'origine
    // --------------------------------------------------------

    const positionOrigine =
        obtenirPositionSurAxe(origine);


    // --------------------------------------------------------
    // Position sur l'axe de la destination
    // --------------------------------------------------------

    const positionDestination =
        obtenirPositionSurAxe(destination);


    if (
        typeof positionOrigine !== "number" ||
        typeof positionDestination !== "number"
    ) {

        return null;

    }


    // --------------------------------------------------------
    // Distance sur l'axe principal
    // --------------------------------------------------------

    const distanceSurAxe =
        Math.abs(
            positionOrigine -
            positionDestination
        );


    // --------------------------------------------------------
    // Ajouter la branche de l'origine
    // --------------------------------------------------------

    const distanceBrancheOrigine =
        origineEstBranche
            ? obtenirDistanceBranche(origine)
            : 0;


    // --------------------------------------------------------
    // Ajouter la branche de la destination
    // --------------------------------------------------------

    const distanceBrancheDestination =
        destinationEstBranche
            ? obtenirDistanceBranche(destination)
            : 0;


    const distanceTotale =
        distanceSurAxe +
        distanceBrancheOrigine +
        distanceBrancheDestination;


    // --------------------------------------------------------
    // Arrondi au dixième
    // --------------------------------------------------------

    return Math.round(
        distanceTotale * 10
    ) / 10;

}


// ============================================================
// 12. MATRICE COMPLÈTE DES DISTANCES
// ============================================================

const donneesDistances = {};


// ------------------------------------------------------------
// Construire toutes les lignes
// ------------------------------------------------------------

villesDistances.forEach(function(origine) {

    donneesDistances[origine] = {};

    villesDistances.forEach(function(destination) {

        donneesDistances[origine][destination] =
            calculerDistance(
                origine,
                destination
            );

    });

});


// ============================================================
// 13. ARRONDISSEMENT FINAL
// ============================================================

villesDistances.forEach(function(origine) {

    villesDistances.forEach(function(destination) {

        const distance =
            donneesDistances[origine][destination];

        if (Number.isFinite(distance)) {

            donneesDistances[origine][destination] =
                Math.round(
                    distance * 10
                ) / 10;

        }

    });

});


// ============================================================
// FIN DU FICHIER
// ============================================================