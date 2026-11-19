// Si le système demande moins d'animations (réglage d'accessibilité), on coupe les effets qui bougent en continu.
const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* Effet glitch sur le nom (seulement sur les pages qui ont un titre .glitch).
   Hors glitch, on remet '' pour retrouver la lueur néon définie dans le CSS. */
const titre = document.querySelector('.glitch');
if (titre && !mouvementReduit) {
    setInterval(() => {
        titre.style.textShadow = Math.random() > 0.8 ?
            '2px 0 var(--neon-cyan), -2px 0 var(--neon-pink)' :
            '';
    }, 150);
}


/* Bruit d'arcade : dépose un fichier "son-click.mp3" dans le dossier "son" pour l'activer */
const sonClick = new Audio('son/son-click.mp3');
sonClick.preload = 'none';
sonClick.volume = 0.5;
let sonDisponible = true;
sonClick.addEventListener('error', () => { sonDisponible = false; }); // fichier absent : on coupe le son sans erreur

document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('click', () => {
        if (!sonDisponible) return;
        sonClick.currentTime = 0; // rejoue le son à chaque clic
        sonClick.play().catch(() => {}); // évite l'erreur si le navigateur bloque le son
    });
});


/* Fond de particules (seulement sur les pages qui ont le canvas) */
let width = window.innerWidth;
let height = window.innerHeight;
const particles = [];

function backgroundAnimation() {
    const backgroundCanvas = document.getElementById('backgroundCanvas');
    if (!backgroundCanvas) return;
    const ctx = backgroundCanvas.getContext('2d');

    const ajusterTaille = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        backgroundCanvas.width = width;
        backgroundCanvas.height = height;
        if (mouvementReduit) dessiner(ctx);
    };
    ajusterTaille();
    window.addEventListener('resize', ajusterTaille);

    for (let i = 0; i < 100; i++) {
        particles.push(createParticle());
    }

    if (mouvementReduit) {
        dessiner(ctx); // fond fixe, sans mouvement
    } else {
        animate(ctx);
    }
}

function createParticle() {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5
    };
}

function dessiner(ctx) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    });
}

function animate(ctx) {
    dessiner(ctx);
    particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
    });
    requestAnimationFrame(() => animate(ctx));
}

window.addEventListener('DOMContentLoaded', backgroundAnimation);
