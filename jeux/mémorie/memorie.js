let EmojisFruits = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🍍", "🥝", "🥭", "🍑"] ;
let EmojisAnimaux = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"] ;
let EmojisDrapeaux = ["🇺🇸", "🇫🇷", "🇩🇪", "🇮🇹", "🇯🇵", "🇰🇷", "🇨🇳", "🇷🇺", "🇧🇷", "🇲🇽"] ;
let EmojisVisages = ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃"] ;
let EmojisObjets = ["📱", "💻", "🖥️", "🖨️", "🖱️", "⌨️", "💾", "💿", "📀", "📼"] ;
let EmojisLoisirs = ["⚽", "🏀", "🏈", "⚾️", "🎾", "🏐", "🎱", "🏓", "🏸", "🥊"] 
let EmojisRaclette = ["images raclette/raceltte_astronaute.png",
    "images raclette/raclette_raclette.png",
    "images raclette/raclette_surf.png",
    "images raclette/Victoire.png",
    "images raclette/raclette_mineur.png",
    "images raclette/raceltte_japon.png",
    "images raclette/raclette_gameuse.png",
    "images raclette/raclette-danceuse.png",
    "images raclette/raclette_muscu.png",
    "images raclette/raclette_petasse.jpg"]


let listesEmoji = [EmojisFruits, EmojisAnimaux, EmojisDrapeaux, EmojisVisages, EmojisObjets, EmojisLoisirs, EmojisRaclette];
let cartesChoisie = [];
let pauseJeu = false
let coups = 0;
let pairesTrouvees = 0;
let temps = 0;
let interval = null;
let jeuLance = false;
let nombrePaires = 10;
let Multijoueur = false;
let joueurActuelle = 1;
let scoreJoueur1 = 0;
let scoreJoueur2 = 0;


function lancerJeu(){
    const modeChoisi = document.getElementById("mode").value;
    Multijoueur = (modeChoisi === "1v1");

    if(Multijoueur){
        document.getElementById("info-solo").classList.add("cache");
        document.getElementById("info-1v1").classList.remove("cache");
        joueurActuelle = 1;
        scoreJoueur1 = 0;
        scoreJoueur2 = 0;
        document.getElementById("score-joueur1").textContent = "0";
        document.getElementById("score-joueur2").textContent = "0";
       majInterfaceJoueur();
        
    }else{
        document.getElementById("info-solo").classList.remove("cache");
        document.getElementById("info-1v1").classList.add("cache");

    }
    const difficulte = document.getElementById("difficulte");
    nombrePaires = parseInt(difficulte.value);

    const conteneur = document.getElementById("conteneur-cartes");
    if(nombrePaires <= 6){
        conteneur.style.gridTemplateColumns = "repeat(4, 80px)";
    }else{
    conteneur.style.gridTemplateColumns = "repeat(5, 80px)";
}

document.getElementById("ecran-accueil").classList.add("cache");
document.getElementById("zone-jeu").classList.remove("cache");

resetgame();
}

function retournerAccueil(){
    clearInterval(interval);
    document.getElementById("ecran-accueil").classList.remove("cache");
    document.getElementById("zone-jeu").classList.add("cache");
    document.getElementById("ecran-victoire").classList.add("cache");  
}     


function prepareJeu(){
    let selectionthemes= document.getElementById("theme");
    let choix = selectionthemes.value;
    let indexTheme;
    if(choix === "aleatoire"){
        indexTheme = Math.floor(Math.random() * listesEmoji.length);
    }else{
        indexTheme = parseInt(choix);
    }
    
    let themeChoisi = listesEmoji[indexTheme]

    let themeReduit = themeChoisi.slice(0, nombrePaires);

    let cartesAmélanger = [...themeReduit,...themeReduit]
    cartesAmélanger.sort(() => Math.random()-0.5)
    genererCartes(cartesAmélanger)
    demarrerChronometre();

}

 function genererCartes(listeMélanger) {
    let conteneurCartes = document.getElementById("conteneur-cartes");
    conteneurCartes.innerHTML = "";
    
    listeMélanger.forEach((item, index) => {
        let carte = document.createElement("div");
        carte.classList.add("carte");
        carte.dataset.emoji = item; 
        
        let contenuDevant;
        if (item.includes(".") || item.includes("/")) {
            contenuDevant = `<img src="${item}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">`;
        } else {
            contenuDevant = item;
        }

        carte.innerHTML = `
            <div class="derriere">?</div>
            <div class="devant">${contenuDevant}</div>`;
            
        carte.addEventListener('click', retournercarte);
        conteneurCartes.appendChild(carte);
    });
}



    function retournercarte(){

        if (pauseJeu) {
            return    
        }
        if(this.classList.contains("retournee")){
            return
        }

        this.classList.add("retournee")
        cartesChoisie.push(this)

        if(cartesChoisie.length===2){
            pauseJeu = true
            setTimeout(verifierPaire,700)

           
        }
            
        }
    

        function verifierPaire(){
            let carte1 = cartesChoisie[0];
            let carte2 = cartesChoisie[1];
            coups++;
            document.getElementById("coups").textContent = coups;

            if(carte1.dataset.emoji=== carte2.dataset.emoji){
                pairesTrouvees++;
                if(Multijoueur){
                    if(joueurActuelle === 1){
                        scoreJoueur1++;
                        document.getElementById("score-joueur1").textContent = scoreJoueur1;
                    }else{
                        scoreJoueur2++;
                        document.getElementById("score-joueur2").textContent = scoreJoueur2;
                    }
                }
                cartesChoisie= []
                pauseJeu = false;
                

                if(pairesTrouvees === nombrePaires){
                    finirPartie();
            }
        }else{
                setTimeout(() => {
               carte1.classList.remove("retournee")
               carte2.classList.remove("retournee")
               cartesChoisie = [];

               if(Multijoueur){
                   joueurActuelle = (joueurActuelle === 1) ? 2 : 1;
                   majInterfaceJoueur();

               }
               pauseJeu = false ;
            } ,700);
            }
            

        }
    
       function majInterfaceJoueur() {
    const joueur1 = document.getElementById("ecran-joueur1");
    const joueur2 = document.getElementById("ecran-joueur2");

    if (joueurActuelle === 1) {
        joueur1.style.color = "#ff7675"; 
        joueur1.style.textShadow = "0 0 10px #ff7675";
        joueur1.style.fontWeight = "bold";
        
        joueur2.style.color = "white";
        joueur2.style.textShadow = "none";
        joueur2.style.fontWeight = "normal";
    } else {
        joueur2.style.color = "#ff7675";
        joueur2.style.textShadow = "0 0 10px #ff7675";
        joueur2.style.fontWeight = "bold";
        
        joueur1.style.color = "white";
        joueur1.style.textShadow = "none";
        joueur1.style.fontWeight = "normal";
    }
}

        function resetgame(){
            coups = 0;
            pairesTrouvees = 0;
            temps = 0;
            cartesChoisie = [];
            jeuLance = false;
            pauseJeu = false;
            joueurActuelle = 1;
            
            clearInterval(interval);
            interval = null;

            document.getElementById("coups").innerText = "0";
            document.getElementById("chronometre").innerText = "0";
            

            const ecranVictoire = document.getElementById("ecran-victoire");
                  ecranVictoire.classList.remove("visible");
                  ecranVictoire.classList.add("cache");
            prepareJeu();
            demarrerChronometre();

        }
        function demarrerChronometre(){
            if(interval) clearInterval(interval);
            interval = setInterval(() => {
                temps++;
                document.getElementById("chronometre").textContent = temps;
            }, 1000);
        }

function finirPartie(){
    clearInterval(interval);
    const texteVictoire = document.getElementById("texte-resultat");
    if(Multijoueur){
        if(scoreJoueur1 > scoreJoueur2){
            texteVictoire.textContent = "Joueur 1 gagne avec " + scoreJoueur1 + " paires!";
        }else if(scoreJoueur2 > scoreJoueur1){
            texteVictoire.textContent = "Joueur 2 gagne avec " + scoreJoueur2 + " paires!";
        }else{
            texteVictoire.textContent = "Egalité !";
        }
    }else{
        texteVictoire.textContent = "Félicitations ! Vous avez trouvé toutes les paires en " + coups + " coups et " + temps + " secondes!";
    }
    document.getElementById("ecran-victoire").classList.remove("cache");
    document.getElementById("ecran-victoire").classList.add("visible");

}

function retournerPortfolio(){
    clearInterval(interval);
    window.location.href = "../../Projets.html";
}
