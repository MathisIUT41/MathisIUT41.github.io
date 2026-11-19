let tableauMots = ['pomme','poire','banane','fraise','cerise','orange','raisin','melon','kiwi','ananas']
let mot = tableauMots[Math.floor(Math.random() * tableauMots.length)]
let affichage = []
let viesRestante= 8;


for (let i = 0; i < mot.length; i++) {
    affichage[i]="-"    
}

console.log(affichage)

while (viesRestante > 0 && affichage.includes("-")) {
    alert("Il vous reste " + viesRestante + " vies. Le mot à deviner : " + affichage.join(" "))
    let proposition = prompt("Entrez une lettre :").toLowerCase()
    let trouve = false
    if(!proposition){
        alert("Veuillez entrer une lettre valide.")
        continue
    }

    for (let i = 0; i < mot.length; i++) {
        if (mot[i] === proposition) {
            affichage[i] = proposition
            trouve = true
        }
    }

    if (!trouve) {
        viesRestante--
    }

    console.log(affichage)
}

if (viesRestante === 0) {
    alert("Vous avez perdu ! Le mot était : " + mot)
} else {
    alert("Félicitations ! Vous avez gagné !")
}

