document.addEventListener('DOMContentLoaded', () => {
    // Navigation Handling for SPA feel
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href.startsWith(window.location.origin) && !link.hash && !link.target) {
            e.preventDefault();
            navigateTo(link.href);
        }
    });

    // Mobile Menu Toggle (if needed later)
});

async function navigateTo(url) {
    const main = document.getElementById('content');

    // Animate Out
    main.classList.add('fade-out');

    setTimeout(async () => {
        try {
            const response = await fetch(url);
            const text = await response.text();

            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newContent = doc.getElementById('content').innerHTML;
            const newTitle = doc.title;

            // Update State
            document.title = newTitle;
            main.innerHTML = newContent;
            window.history.pushState({}, '', url);

            // Re-run scripts if necessary (e.g. Typewriter)
            initPageScripts();

            // Scroll to top
            window.scrollTo(0, 0);

            // Animate In
            main.classList.remove('fade-out');
        } catch (err) {
            console.error('Navigation error:', err);
            window.location.href = url; // Fallback
        }
    }, 400);
}

window.addEventListener('popstate', () => {
    // Handle back button
    window.location.reload();
});

function initPageScripts() {
    // Re-initialize any dynamic components like typewriters or observers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

    // Typewriter Logic
    const typeWriterElement = document.getElementById('typewriter');
    if (typeWriterElement) {
        // Clear any existing interval/timeouts if possible, but here we just restart
        const phrases = ["Sustainable Mobility", "Electric Vehicles", "Government Projects", "Aerodynamic Design"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        // Prevent multiple instances if navigating back and forth rapidly (rudimentary check)
        if (typeWriterElement.dataset.typing === "true") return;
        typeWriterElement.dataset.typing = "true";

        function type() {
            // Check if element still exists (user might have navigated away)
            if (!document.getElementById('typewriter')) return;

            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typeWriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }
}

// Initial Run
initPageScripts();
