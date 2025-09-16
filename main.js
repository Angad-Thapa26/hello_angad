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
                speed: 5,
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

// Back to Top button functionality
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}); 

        document.getElementById('back-to-top').addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    // Toggle menu
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Cybersecurity Quiz Game Logic
document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackElement = document.getElementById('quiz-feedback');
    const scoreElement = document.getElementById('quiz-score');
    const progressElement = document.getElementById('quiz-progress');
    const restartButton = document.getElementById('quiz-restart');
    const badgesContainer = document.getElementById('skill-badges');

    if (!questionElement || !optionsContainer || !scoreElement || !progressElement || !badgesContainer) {
        return; // Quiz UI not present on this page
    }

    const questions = [
        {
            q: 'You receive an email asking for your VPN password. What do you do?',
            options: ['Reply with the password', 'Click the link to verify', 'Report as phishing', 'Forward to friends'],
            answerIndex: 2,
            award: ['Cybersecurity']
        },
        {
            q: 'Which layer does a router primarily operate on?',
            options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
            answerIndex: 1,
            award: ['Networking']
        },
        {
            q: 'Best practice for strong authentication is…',
            options: ['Same password everywhere', '2FA/MFA enabled', 'Password in notes app', 'Share with team'],
            answerIndex: 1,
            award: ['Security Best Practices']
        },
        {
            q: 'A web app exposes sensitive data over HTTP. First fix?',
            options: ['Enable HTTPS/TLS', 'Change color theme', 'Increase server RAM', 'Add more ads'],
            answerIndex: 0,
            award: ['Web Security']
        },
        {
            q: 'You’re leading an incident bridge. What is key?',
            options: ['Silence', 'Clear roles and updates', 'Blame people', 'Ignore stakeholders'],
            answerIndex: 1,
            award: ['Leadership']
        },
        {
            q: 'Presenting a risk report to non-tech management. What helps?',
            options: ['Acronyms everywhere', 'Speak fast', 'Plain language and analogies', 'Binary dumps'],
            answerIndex: 2,
            award: ['Public Speaking']
        },
        {
            q: 'Mentoring a junior on OWASP Top 10. Best approach?',
            options: ['Do it yourself', 'Give links only', 'Pair on an example vuln', 'Say “figure it out”'],
            answerIndex: 2,
            award: ['Mentorship']
        },
        {
            q: 'Writing a blog about a CTF write-up. What’s important?',
            options: ['Clickbait only', 'No steps', 'Clear steps and insights', 'Only memes'],
            answerIndex: 2,
            award: ['Content Writing']
        },
        {
            q: 'Network troubleshooting: which command checks default gateway reachability?',
            options: ['ipconfig/ifconfig', 'tracert/traceroute', 'ping', 'nslookup/dig'],
            answerIndex: 2,
            award: ['Networking']
        },
        {
            q: 'You suspect SQL injection. First defensive control?',
            options: ['Concatenate strings', 'Parameterized queries', 'Disable DB logs', 'Hope for the best'],
            answerIndex: 1,
            award: ['Cybersecurity']
        }
    ];

    const allBadges = [
        { name: 'Cybersecurity', icon: 'fa-shield-halved' },
        { name: 'Networking', icon: 'fa-network-wired' },
        { name: 'Web Security', icon: 'fa-lock' },
        { name: 'Security Best Practices', icon: 'fa-user-shield' },
        { name: 'Content Writing', icon: 'fa-pen-nib' },
        { name: 'Leadership', icon: 'fa-chess-king' },
        { name: 'Public Speaking', icon: 'fa-microphone' },
        { name: 'Mentorship', icon: 'fa-people-group' }
    ];

    let current = 0;
    let score = 0;
    let unlocked = new Set();

    function updateBadges() {
        badgesContainer.innerHTML = '';
        allBadges.forEach(b => {
            const isUnlocked = unlocked.has(b.name);
            const el = document.createElement('span');
            el.className = 'badge' + (isUnlocked ? '' : ' locked');
            el.innerHTML = `<i class="fa-solid ${b.icon}"></i> ${b.name}`;
            badgesContainer.appendChild(el);
        });
    }

    function renderQuestion() {
        const total = questions.length;
        progressElement.textContent = `${Math.min(current + 1, total)}/${total}`;
        scoreElement.textContent = String(score);
        feedbackElement.textContent = '';

        if (current >= total) {
            questionElement.textContent = 'Mission complete. System secured.';
            optionsContainer.innerHTML = '';
            const summary = document.createElement('div');
            summary.className = 'quiz-feedback';
            summary.textContent = `Final Score: ${score}/${total}`;
            optionsContainer.appendChild(summary);
            return;
        }

        const item = questions[current];
        questionElement.textContent = item.q;
        optionsContainer.innerHTML = '';

        item.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleAnswer(idx));
            optionsContainer.appendChild(btn);
        });
    }

    function handleAnswer(selectedIdx) {
        const item = questions[current];
        const optionButtons = Array.from(optionsContainer.querySelectorAll('.quiz-option'));
        optionButtons.forEach((b, idx) => {
            b.disabled = true;
            if (idx === item.answerIndex) b.classList.add('correct');
            if (idx === selectedIdx && selectedIdx !== item.answerIndex) b.classList.add('wrong');
        });

        if (selectedIdx === item.answerIndex) {
            score += 1;
            feedbackElement.textContent = 'Correct ✅';
            item.award.forEach(a => unlocked.add(a));
            updateBadges();
        } else {
            feedbackElement.textContent = 'Not quite ❌';
        }

        setTimeout(() => {
            current += 1;
            renderQuestion();
        }, 800);
    }

    function restartQuiz() {
        current = 0;
        score = 0;
        unlocked = new Set();
        updateBadges();
        renderQuestion();
    }

    if (restartButton) {
        restartButton.addEventListener('click', restartQuiz);
    }

    // Initialize
    updateBadges();
    renderQuestion();
});
