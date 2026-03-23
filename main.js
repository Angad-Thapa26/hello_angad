document.addEventListener("DOMContentLoaded", function () {

    var loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        setTimeout(function () {
            loadingScreen.classList.add("hidden");
            document.body.classList.add("page-loaded");
        }, 4000);
    } else {
        document.body.classList.add("page-loaded");
    }

  
    var yearEl = document.getElementById("copyright-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    if (typeof emailjs !== "undefined") {
        emailjs.init("35mH8tFQmHgx4MOmZ");
    }

    var particlesContainer = document.getElementById("particles-js");
    if (particlesContainer && typeof particlesJS !== "undefined") {
        var isMobile = window.innerWidth <= 768;
        particlesJS("particles-js", {
            particles: {
                number: {
                    value: isMobile ? 30 : 80,
                    density: { enable: true, value_area: 800 },
                },
                color: { value: "#00ff00" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00ff00",
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: isMobile ? 2 : 5,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                },
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: !isMobile, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true,
                },
            },
            retina_detect: true,
        });
    }

    var terminalTexts = document.querySelectorAll(".terminal-text");
    terminalTexts.forEach(function (text, index) {
        text.style.opacity = "0";
        setTimeout(function () {
            text.style.opacity = "1";
            text.style.animation = "typing 1s steps(40, end)";
        }, index * 1000);
    });

    var statNumbers = document.querySelectorAll(".stat-number");
    if (statNumbers.length > 0) {
        var statsAnimated = false;
        var statsObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !statsAnimated) {
                        statsAnimated = true;
                        animateCounters();
                    }
                });
            },
            { threshold: 0.5 }
        );

        var statsSection = document.getElementById("stats");
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    function animateCounters() {
        statNumbers.forEach(function (counter) {
            var target = parseInt(counter.getAttribute("data-target"), 10);
            var current = 0;
            var increment = Math.max(1, Math.floor(target / 40));
            var timer = setInterval(function () {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current;
            }, 50);
        });
    }

    var skillBars = document.querySelectorAll(".progress");
    if (skillBars.length > 0) {
        var skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var percent = entry.target.getAttribute("data-percent");
                    entry.target.style.width = percent + "%";
                }
            });
        });
        skillBars.forEach(function (bar) {
            skillObserver.observe(bar);
        });
    }

    var backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", function () {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add("visible");
            } else {
                backToTopButton.classList.remove("visible");
            }
        });

        backToTopButton.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
    var hamburger = document.querySelector(".hamburger");
    var navLinks = document.querySelector(".nav-links");
    var navLinksItems = document.querySelectorAll(".nav-links li");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
            var expanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", String(!expanded));
        });

        navLinksItems.forEach(function (item) {
            item.addEventListener("click", function () {
                navLinks.classList.remove("active");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
        document.addEventListener("click", function (e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove("active");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });
    }

    var adminLoginBtn = document.getElementById("admin-login-btn");
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener("click", function () {
            this.style.transform = "scale(1.2)";
            this.style.transition = "transform 0.2s ease";
            var self = this;
            setTimeout(function () {
                self.style.transform = "scale(1)";
            }, 200);
            setTimeout(function () {
                window.location.href = "admin-login.html";
            }, 300);
        });

        adminLoginBtn.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.click();
            }
        });

        adminLoginBtn.addEventListener("mouseenter", function () {
            this.style.textShadow = "0 0 10px #00ff00";
        });

        adminLoginBtn.addEventListener("mouseleave", function () {
            this.style.textShadow = "none";
        });
    }

});
