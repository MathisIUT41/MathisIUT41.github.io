

let dicoDeMots= new Set();

async function chargerLeDicoDeMots(){
    try {
        
        const reponse = await fetch("Données/listes_validation.json"); 
        const liste = await reponse.json();
        
        // Mettre tout en majuscule
        dicoDeMots= new Set(liste.map(mot => mot.toUpperCase()));
        console.log("Grand dictionnaire chargé : " + dicoDeMots.size + " mots.");
    } catch (erreur) {
        console.error("Erreur de chargement du dictionnaire de référence :", erreur);
    }
}

chargerLeDicoDeMots();

function estMotFrancais(mot){
    const motClean=mot.toUpperCase().trim();
    if (dicoDeMots.size===0) {
        console.log("Attention : Le dico de mots de reference est vide ! ")
        return true 
    }
    if (dicoDeMots.has(motClean)) {
            return true    
    }else{
        console.log("Mot refusé : " + motClean)
        return false
    }
}





function verifer2mots(motsUtilisateur, motsAdeviner){
    let resultat  = new Array(motsAdeviner.length).fill("GRIS");
    let motsRestant = motsAdeviner.split("");

    for (let index = 0; index < motsUtilisateur.length; index++) {
        if (motsUtilisateur[index]===motsAdeviner[index]) {
            resultat[index]="VERT"
            motsRestant[index]= null
        }
        
    }

    for (let index = 0; index < motsAdeviner.length; index++) {
        if(resultat[index] !== "VERT"){
            let indexTrouve = motsRestant.indexOf(motsUtilisateur[index])
            if (indexTrouve !== -1) {
                resultat[index]="JAUNE"
                motsRestant[indexTrouve] = null 
                
            }
        }
        
    }
    return resultat

}




// 1. LES VARIABLES
let motADeviner = "";
let ligneActuelle = 0;
let partieFinie = false;

// Messages affichés dans la page (à la place des alert)
const zoneMessage = document.getElementById("message");
let minuteurMessage = null;
function afficherMessage(texte, type = "info") {
    if (!zoneMessage) return;
    clearTimeout(minuteurMessage);
    zoneMessage.textContent = texte;
    zoneMessage.className = type;
    if (type === "info" && texte) {
        minuteurMessage = setTimeout(() => { zoneMessage.textContent = ""; }, 2000);
    }
}
const dicoTouches={};
const toutelesTouches=document.querySelectorAll(".Touche");
toutelesTouches.forEach(touche => {
    const lettre = touche.textContent.toUpperCase();    
    dicoTouches[lettre] = touche;
});


const grille = document.getElementById("grille");



 async function lancerJeu() {
    try {
        // on recupe le theme choisi par l'utilisateur 
        const menuTheme = document.getElementById("choix-theme");
        const nomFichier = menuTheme.value;
        
        
       // on charge le fichier
        const reponse = await fetch("Données/themes/" + nomFichier);
        const listeMots = await reponse.json(); 

        // Chois mots hazard
        let motTire = listeMots[Math.floor(Math.random() * listeMots.length)];
        motADeviner = motTire.toUpperCase();

        // Reset interface
        ligneActuelle = 0;
        motSaisiActuel = "";
        partieFinie = false;
        afficherMessage("");
        grille.innerHTML = "";
        grille.style.setProperty("--nb", motADeviner.length); // taille des cases adaptée à l'écran

        toutelesTouches.forEach(touche => {
            touche.style.backgroundColor = "rgb(129, 131, 132)"; 
        });

        // 4. Grille
        for (let i = 0; i < 6; i++) {
            const ligne = document.createElement("div");
            ligne.className = "ligne";
            for (let j = 0; j < motADeviner.length; j++) {
                const uneCase = document.createElement("div");
                uneCase.className = "case";
                ligne.appendChild(uneCase);
            }
            grille.appendChild(ligne);
        }

        console.log("Nouveau mot chargé (" + motADeviner.length + " lettres)");

    } catch (error) {
        console.error("Erreur lors du chargement du thème :", error);
        afficherMessage("Impossible de charger ce thème. Réessaie.", "defaite");
    }
}
 

function verifierMot(motsUtilisateur) {
    const cases = document.getElementsByClassName("case");
    const longueurMot = motADeviner.length;
    
    // ON APPELLE TA FONCTION ICI
    const resultatsCouleurs = verifer2mots(motsUtilisateur, motADeviner);

    for (let i = 0; i < longueurMot; i++) {
        let indexCase = ligneActuelle * longueurMot + i;
        let caseAColorier = cases[indexCase];
        caseAColorier.textContent = motsUtilisateur[i];

        let lettreCourante = motsUtilisateur[i].toUpperCase();
        let toucheClavier = dicoTouches[lettreCourante];
        
        // On applique les couleurs basées sur ton tableau 'resultatsCouleurs'
        if (resultatsCouleurs[i] === "VERT") {
            caseAColorier.style.backgroundColor = "rgb(106, 170, 100)";
            if (toucheClavier) toucheClavier.style.backgroundColor = "rgb(106, 170, 100)";
        } 
        else if (resultatsCouleurs[i] === "JAUNE") {
            caseAColorier.style.backgroundColor = "rgb(201, 180, 88)";
            if (toucheClavier && toucheClavier.style.backgroundColor !== "rgb(106, 170, 100)") {
                toucheClavier.style.backgroundColor = "rgb(201, 180, 88)";
            }
        } 
        else {
            caseAColorier.style.backgroundColor = "rgb(58, 58, 60)";
            if (toucheClavier && toucheClavier.style.backgroundColor !== "rgb(106, 170, 100)" && toucheClavier.style.backgroundColor !== "rgb(201, 180, 88)") {
                toucheClavier.style.backgroundColor = "rgb(58, 58, 60)";
            }
        }
    }

    if (motsUtilisateur === motADeviner) {
        const essais = ligneActuelle + 1;
        partieFinie = true;
        afficherMessage("Bravo ! Trouvé en " + essais + (essais > 1 ? " essais" : " essai") + " 🎉", "victoire");
    } else {
        ligneActuelle++;
        if (ligneActuelle === 6) {
            partieFinie = true;
            afficherMessage("Perdu ! Le mot était : " + motADeviner, "defaite");
        }
    }
}



let motSaisiActuel = ""

// Une seule fonction pour toutes les entrées : clavier physique, clavier à l'écran et bouton Valider
function gererTouche(cle) {
    if (partieFinie || !motADeviner) return;
    const touche = cle.toUpperCase();

    if (touche === "ENTER") {
        validerMot();
        return;
    }
    if (touche === "BACKSPACE") {
        motSaisiActuel = motSaisiActuel.slice(0, -1); // On retire la dernière lettre
        mettreAJourCases();
        return;
    }
    if (touche.length === 1 && touche >= "A" && touche <= "Z") {
        if (motSaisiActuel.length < motADeviner.length) {
            motSaisiActuel += touche; // On ajoute la lettre à notre mémoire
            mettreAJourCases();       // On l'affiche dans la grille
        }
    }
}

function validerMot() {
    if (partieFinie) return;
    if (motSaisiActuel.length !== motADeviner.length) {
        afficherMessage("Mot trop court !");
        return;
    }
    if (!estMotFrancais(motSaisiActuel)) {
        afficherMessage("Ce mot n'existe pas !");
        return;
    }
    verifierMot(motSaisiActuel); // On lance la vérification des couleurs
    motSaisiActuel = "";         // On vide la mémoire pour la ligne suivante
}

// Clavier physique (sauf quand on est dans le menu des thèmes)
document.addEventListener("keydown", (event) => {
    if (event.target.tagName === "SELECT") return;
    if (event.key === "Enter" && event.target.tagName === "BUTTON") return; // évite un double envoi
    gererTouche(event.key);
});

// Clavier à l'écran : souris et doigt
toutelesTouches.forEach(touche => {
    touche.addEventListener("click", () => {
        gererTouche(touche.dataset.key || touche.textContent);
        touche.blur();
    });
});

// Bouton Valider
document.getElementById("Validation").addEventListener("click", (event) => {
    validerMot();
    event.currentTarget.blur();
});

function mettreAJourCases(){
    const cases = document.getElementsByClassName("case");
    const debutLigne = ligneActuelle * motADeviner.length;

    for (let i = 0; i < motADeviner.length; i++) {
        
        cases[debutLigne + i].textContent = motSaisiActuel[i] || "";
    }
}






if(document.getElementById("rejouer")){
    document.getElementById("rejouer").addEventListener("click", lancerJeu);
}
document.getElementById("choix-theme").addEventListener("change", lancerJeu);

lancerJeu();

