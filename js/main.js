document.addEventListener("DOMContentLoaded", function() {
    // Particles.js configuration
    particlesJS("particles-js", {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#00ff00"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#00ff00",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            }
        },
        retina_detect: true
    });

    // Terminal text animation
    const terminalTexts = document.querySelectorAll('.terminal-text');
    terminalTexts.forEach((text, index) => {
        text.style.opacity = '0';
        setTimeout(() => {
            text.style.opacity = '1';
            text.style.animation = 'typing 1s steps(40, end)';
        }, index * 1000);
    });
});

// Animate skill bars when they come into view
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent');
                entry.target.style.width = `${percent}%`;
            }
        });
    });

    skillBars.forEach(bar => observer.observe(bar));
}

// Call the function when document is loaded
document.addEventListener('DOMContentLoaded', animateSkillBars); 