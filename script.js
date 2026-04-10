document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURATION ===
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    const presentBtn = document.getElementById('presentBtn');
    const slidesContainer = document.getElementById('slidesContainer');
    const dotsContainer = document.getElementById('slideDots');

    // === INITIALISATION ===
    function initPresentation() {
        // Mettre à jour le texte du total
        totalSlidesEl.textContent = totalSlides;
        
        // Créer les dots
        createDots();
        
        // Afficher la première slide
        showSlide(0);
        
        console.log(`Présentation initialisée avec ${totalSlides} slides.`);
    }

    // === FONCTIONS ===

    function createDots() {
        dotsContainer.innerHTML = ''; // Nettoyer
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => showSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function showSlide(index) {
        // Gérer les limites
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        // Mise à jour de l'état
        currentSlide = index;

        // Gestion des classes CSS
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');

        // Mise à jour des compteurs
        currentSlideEl.textContent = currentSlide + 1;

        // Mise à jour des boutons
        prevBtn.disabled = (currentSlide === 0);
        nextBtn.disabled = (currentSlide === totalSlides - 1);

        // Mise à jour des dots
        updateDots();
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            slidesContainer.requestFullscreen().catch(err => {
                alert(`Erreur: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // === EVENT LISTENERS ===

    // Boutons Précédent / Suivant
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

    // Bouton Présentation (Plein écran)
    presentBtn.addEventListener('click', toggleFullScreen);

    // Navigation Clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            showSlide(currentSlide + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            showSlide(currentSlide - 1);
        } else if (e.key === 'Home') {
            showSlide(0);
        } else if (e.key === 'End') {
            showSlide(totalSlides - 1);
        } else if (e.key === 'f') {
            toggleFullScreen();
        }
    });

    // Navigation Tactile (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50; // Distance min pour swipe
        if (touchEndX < touchStartX - threshold) {
            showSlide(currentSlide + 1); // Swipe gauche -> Suivant
        }
        if (touchEndX > touchStartX + threshold) {
            showSlide(currentSlide - 1); // Swipe droit -> Précédent
        }
    }

    // Lancement
    initPresentation();
});