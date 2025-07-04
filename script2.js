document.addEventListener('DOMContentLoaded', () => {

    // --- Sparkle Effect ---
    const sparklesContainer = document.querySelector('.sparkles-container');
    const numSparkles = 70;
    const sparkleColors = [
        "rgba(200, 200, 200, 0.4)", // Light grey, subtle
        "rgba(150, 180, 255, 0.4)", // Light blue
        "rgba(180, 150, 255, 0.4)", // Light purple
        "rgba(220, 220, 220, 0.3)"  // Even lighter grey
    ];
    const maxSize = 2;

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        const size = Math.random() * maxSize + 1;
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        const delay = Math.random() * 5;

        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.backgroundColor = color;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animation = `sparkle-animation 2s ease-in-out infinite ${delay}s`;

        sparklesContainer.appendChild(sparkle);

        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
            setTimeout(createSparkle, Math.random() * 1000);
        });
    }

    for (let i = 0; i < numSparkles; i++) {
        createSparkle();
    }

    // --- Scroll-Triggered Animations ---
    const faders = document.querySelectorAll('.scroll-fade-in');

    const appearOptions = {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries,
        appearOnScroll
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Navbar Active State Logic (Updated for both navs) ---
    const allNavItems = document.querySelectorAll('.bottom-navbar .nav-item, .top-navbar .top-nav-item');
    const sections = document.querySelectorAll('section[id]'); // Select sections that have an ID

    // Function to set active nav item
    function setActiveNavItem() {
        let currentActiveSectionId = '';
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Determine if the section is primarily in view
            // Adjust this logic if you want different active-state triggers
            if (scrollY >= sectionTop - viewportHeight / 2 &&
                scrollY < sectionTop + sectionHeight - viewportHeight / 2) {
                currentActiveSectionId = section.id;
            }
        });

        // If at the very top of the page and no other section is active, default to 'hero'
        if (currentActiveSectionId === '' && scrollY < sections[0].offsetTop + sections[0].clientHeight / 2) {
             currentActiveSectionId = 'hero';
        }


        allNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === currentActiveSectionId) {
                item.classList.add('active');
            }
        });
    }

    // Add event listeners for scroll and initial load
    window.addEventListener('scroll', setActiveNavItem);
    setActiveNavItem(); // Call on initial load

    // Smooth scroll for nav items (both top and bottom)
    allNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent default behavior only for internal section links
            const targetId = this.dataset.section;
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                const targetSection = document.getElementById(targetId);
                window.scrollTo({
                    top: targetSection.offsetTop - (window.innerWidth >= 769 ? document.querySelector('.top-navbar').offsetHeight : 0), // Adjust for fixed top navbar
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Canvas Background Animation ---
    const canvas = document.getElementById('heroBackgroundCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 70; // Number of particles
    const maxParticleSize = 1.5; // Max radius of particles
    const connectDistance = 120; // Max distance to connect particles with lines

    // Particle colors for light theme
    const particleColors = [
        getComputedStyle(document.documentElement).getPropertyValue('--particle-color-1'),
        getComputedStyle(document.documentElement).getPropertyValue('--particle-color-2'),
        getComputedStyle(document.documentElement).getPropertyValue('--text-color').replace(')', ', 0.1)').replace('rgb', 'rgba') // Very light text color version
    ];
    const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-line-color');

    // Handle canvas resize
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * maxParticleSize + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5; // Slower movement
            this.speedY = (Math.random() - 0.5) * 0.5; // Slower movement
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw lines between nearby particles
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectDistance) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    // Initialize and start animation
    resizeCanvas();
    initParticles();
    animateParticles();

    // Event listener for window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles(); // Re-initialize particles to spread them correctly
        setActiveNavItem(); // Re-evaluate active nav item on resize
    });
});


    