// KhelSetu Feature Card Reveal

const featureCards = document.querySelectorAll(".feature-card");

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");

            // Reveal only once
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

// Observe all feature cards
featureCards.forEach((card) => {
    observer.observe(card);
});