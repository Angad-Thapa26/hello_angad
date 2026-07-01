(function () {
    var STORAGE_KEY = "know_angad_custom_certificates_v1";
    var UPDATE_EVENT = "know-angad:certificates-updated";

    var baseCertificates = [
        {
            id: "base-u-tec-hackathon",
            category: "ach",
            featured: true,
            title: "Runner-up Award - U-tec Hackathon",
            imageSrc: "image/ack/ack-hac2.jpeg",
            imageAlt: "Runner-up award certificate from U-tec Beta Hackathon 2024",
            link: "image/ack/ack-hac2.jpeg",
            details: [
                { label: "Project", value: "Traditional shopping adapted with digital technologies, connecting local businesses with local consumers." },
                { label: "Issuing Organization", value: "U-tec" }
            ]
        },
        {
            id: "base-mastermind-auditor",
            category: "course",
            featured: true,
            title: "Lead Auditor ISO 27001:2022",
            imageSrc: "image/certification/leadAuditor.png",
            imageAlt: "Lead Auditor ISO 27001:2022 certification from Mastermind",
            link: "https://learn.mastermindassurance.com/certificates/lr8b8xycsm",
            details: [
                { label: "Skills", value: "ISMS, Risk Assessment, Internal Audit, ISO/IEC 27001, ISO/IEC 27006" },
                { label: "Issuing Organization", value: "Mastermind" }
            ]
        },
        {
            id: "base-ncc-training",
            category: "ack",
            featured: true,
            title: "100-Day Personal Development Training",
            imageSrc: "image/participation/par-ncc.jpeg",
            imageAlt: "NCC 100-day personal development training certificate from Nepal Army",
            link: "image/participation/par-ncc.jpeg",
            details: [
                { label: "Description", value: "Patriotism and self-building on leadership and discipline by Nepal Army." },
                { label: "Issuing Organization", value: "National Cadet Corps, Nepal Army" }
            ]
        },
        {
            id: "base-cisco-ethical-hacker",
            category: "course",
            title: "Ethical Hacker",
            imageSrc: "image/certification/cisco_ethical_hacker.png",
            imageAlt: "Cisco Networking Academy ethical hacker certificate",
            link: "image/certification/cisco_ethical_hacker.png",
            details: [
                { label: "Issuing Organization", value: "Cisco NetAcad" },
                { label: "Skills", value: "Ethical Hacking tools and techniques" },
                { label: "Credit", value: "60 Hours" },
                { label: "Issued", value: "May 2026" }
            ]
        },
        {
            id: "base-ruijie-routing-switching",
            category: "course",
            title: "RUIJIE Routing and Switching",
            imageSrc: "image/certification/ruijie-r&s.png",
            imageAlt: "RUIJIE Routing and Switching certification",
            link: "image/certification/ruijie-r&s.png",
            details: [
                { label: "Skills", value: "Fundamentals of Networking, Routing Protocols, Switching Technologies, Network Security" },
                { label: "Issuing Organization", value: "RUIJIE" }
            ]
        },
        {
            id: "base-cisco-intro-cybersecurity",
            category: "course",
            title: "Introduction to Cybersecurity",
            imageSrc: "image/certification/cer-netacad1.png",
            imageAlt: "Cisco Networking Academy Introduction to Cybersecurity certificate",
            link: "image/certification/cer-netacad1.png",
            details: [
                { label: "Issuing Organization", value: "Cisco" },
                { label: "Skills", value: "Cyber Best Practices, Cybersecurity, Network Vulnerabilities, Privacy and Data Confidentiality, Threat Detection" },
                { label: "Issued", value: "June 2025" }
            ]
        },
        {
            id: "base-ccna-intro-networking",
            category: "course",
            title: "CCNA Introduction to Networking",
            imageSrc: "image/certification/ccna-m1.png",
            imageAlt: "CCNA Introduction to Networking certificate from Cisco",
            link: "image/certification/ccna-m1.png",
            details: [
                { label: "Issuing Organization", value: "Cisco" },
                { label: "Skills", value: "Networking Fundamentals, IP Addressing, Routing Protocols, Switching Concepts" },
                { label: "Issued", value: "June 2025" }
            ]
        },
        {
            id: "base-crpo",
            category: "course",
            title: "Certified Risk and Privacy Officer (CRPO)",
            imageSrc: "image/certification/crpo.png",
            imageAlt: "Certified Risk and Privacy Officer (CRPO) from EU Cyber Academy",
            link: "image/certification/crpo.png",
            details: [
                { label: "Skills", value: "Privacy Program Management, Risk Assessment, Data Protection Regulations, Incident Response, Privacy by Design" },
                { label: "Issuing Organization", value: "EU Cyber Academy" }
            ]
        },
        {
            id: "base-python-basics",
            category: "course",
            title: "Python Basics and Practical",
            imageSrc: "image/certification/python_b.png",
            imageAlt: "Python Basics and Practical certificate from Programiz",
            link: "https://programiz.pro/certificates/detail/1B3CC3B43822",
            details: [
                { label: "Issuing Organization", value: "Programiz" },
                { label: "Skills", value: "Python Syntax, Data Types, Control Structures, Functions, Modules" }
            ]
        },
        {
            id: "base-code-for-change",
            category: "course",
            title: "Certificate of Participation",
            imageSrc: "image/certification/cer-c4c.jpeg",
            imageAlt: "Code for Change cybersecurity workshop certificate",
            link: "image/certification/cer-c4c.jpeg",
            details: [
                { label: "Workshop", value: "Cybersecurity Essentials to Advanced" },
                { label: "Issuing Organization", value: "Code For Change" },
                { label: "Skills", value: "Advanced Kali Linux, Cryptography, Network Security, Metasploit Framework, Web Application Security, Bug Bounty Hunting" },
                { label: "Issued", value: "June 2025" }
            ]
        },
        {
            id: "base-it-quiz",
            category: "ach",
            title: "IT Quiz - 2nd Position",
            imageSrc: "image/ack/ack-itquize2.jpeg",
            imageAlt: "IT Quiz 2nd position certificate from Forbes CCSA Club",
            link: "image/ack/ack-itquize2.jpeg",
            details: [
                { label: "Issuing Organization", value: "Forbes CCSA Club" }
            ]
        },
        {
            id: "base-program-management",
            category: "ack",
            title: "Program Management Contribution Acknowledgement",
            imageSrc: "image/participation/par-forbes.jpeg",
            imageAlt: "Program management contribution acknowledgement from Forbes College",
            link: "image/participation/par-forbes.jpeg",
            details: [
                { label: "Issuing Organization", value: "Forbes College" }
            ]
        },
        {
            id: "base-codefest",
            category: "ack",
            title: "Acknowledgement of Participation - Codefest 2025",
            imageSrc: "image/participation/cfchack1.jpeg",
            imageAlt: "Acknowledgement of participation in Codefest 2025 hackathon",
            link: "image/participation/cfchack1.jpeg",
            details: [
                { label: "Issuing Organization", value: "Code for Change" }
            ]
        }
    ];

    function canUseStorage() {
        try {
            var testKey = "__know_angad_storage_test__";
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    function readCustomCertificates() {
        try {
            var rawValue = canUseStorage() ? window.localStorage.getItem(STORAGE_KEY) : window.__knowAngadCustomCertificates;
            var parsedValue = rawValue ? JSON.parse(rawValue) : [];
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch (error) {
            return [];
        }
    }

    function writeCustomCertificates(certificates) {
        if (canUseStorage()) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
        } else {
            window.__knowAngadCustomCertificates = JSON.stringify(certificates);
        }

        document.dispatchEvent(new CustomEvent(UPDATE_EVENT));
    }

    function getAllCertificates() {
        return baseCertificates.concat(readCustomCertificates());
    }

    function getFeaturedCertificates() {
        return baseCertificates.filter(function (certificate) {
            return Boolean(certificate.featured);
        });
    }

    function getVisibleCertificates(view, limit) {
        var certificates = view === "featured" ? getFeaturedCertificates() : getAllCertificates();
        if (typeof limit === "number" && limit > 0) {
            return certificates.slice(0, limit);
        }

        return certificates;
    }

    function createCertificateId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return "cert-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    }

    function addCustomCertificate(certificate) {
        var certificates = readCustomCertificates();
        certificates.unshift(certificate);
        writeCustomCertificates(certificates);
        return certificate;
    }

    function removeCustomCertificate(id) {
        var certificates = readCustomCertificates().filter(function (certificate) {
            return certificate.id !== id;
        });

        writeCustomCertificates(certificates);
    }

    function clearCustomCertificates() {
        writeCustomCertificates([]);
    }

    function createCertificateCard(certificate) {
        var card = document.createElement("article");
        card.className = "certificate-item show";
        card.setAttribute("data-category", certificate.category || "course");
        card.setAttribute("data-certificate-id", certificate.id || "");
        if (certificate.source === "custom") {
            card.setAttribute("data-certificate-source", "custom");
        }

        if (certificate.source === "custom") {
            var badge = document.createElement("span");
            badge.className = "certificate-badge";
            badge.textContent = "Admin Added";
            card.appendChild(badge);
        }

        var link = document.createElement("a");
        var destination = certificate.link || certificate.imageSrc;
        link.className = "certificate-image-link";
        link.href = destination;
        if (/^https?:\/\//i.test(destination)) {
            link.target = "_blank";
            link.rel = "noopener";
        }

        var image = document.createElement("img");
        image.src = certificate.imageSrc;
        image.alt = certificate.imageAlt || certificate.title;
        image.loading = "lazy";
        image.width = 400;
        image.height = 280;
        image.setAttribute("data-lightbox-title", certificate.title || "Certificate image");
        image.setAttribute("data-lightbox-link", destination);
        link.appendChild(image);
        card.appendChild(link);

        var details = document.createElement("div");
        details.className = "certificate-details";

        var title = document.createElement("h3");
        title.textContent = certificate.title;
        details.appendChild(title);

        (certificate.details || []).forEach(function (detail) {
            var paragraph = document.createElement("p");
            paragraph.textContent = detail.label + ": ";

            if (detail.href) {
                var detailLink = document.createElement("a");
                detailLink.href = detail.href;
                detailLink.target = "_blank";
                detailLink.rel = "noopener";
                detailLink.className = "email-link";
                detailLink.textContent = detail.value;
                paragraph.appendChild(detailLink);
            } else {
                paragraph.appendChild(document.createTextNode(detail.value));
            }

            details.appendChild(paragraph);
        });

        card.appendChild(details);
        return card;
    }

    function renderContainers() {
        var containers = document.querySelectorAll("[data-certificate-view]");
        containers.forEach(function (container) {
            var view = container.getAttribute("data-certificate-view") || "all";
            var limit = parseInt(container.getAttribute("data-certificate-limit") || "0", 10);
            var certificates = getVisibleCertificates(view, Number.isNaN(limit) ? 0 : limit);

            container.innerHTML = "";
            certificates.forEach(function (certificate) {
                container.appendChild(createCertificateCard(certificate));
            });
        });
    }

    function renderCustomCertificateList(container) {
        if (!container) {
            return;
        }

        var certificates = readCustomCertificates();
        container.innerHTML = "";

        if (certificates.length === 0) {
            var emptyMessage = document.createElement("p");
            emptyMessage.className = "admin-empty-state";
            emptyMessage.textContent = "No custom certificates saved yet.";
            container.appendChild(emptyMessage);
            return;
        }

        certificates.forEach(function (certificate) {
            var item = document.createElement("article");
            item.className = "admin-certificate-list-item";

            var image = document.createElement("img");
            image.src = certificate.imageSrc;
            image.alt = certificate.imageAlt || certificate.title;
            image.loading = "lazy";
            item.appendChild(image);

            var content = document.createElement("div");

            var title = document.createElement("h3");
            title.textContent = certificate.title;
            content.appendChild(title);

            var meta = document.createElement("p");
            meta.className = "admin-certificate-meta";
            meta.textContent = [certificate.category, certificate.organization].filter(Boolean).join(" - ");
            content.appendChild(meta);

            if (certificate.description) {
                var description = document.createElement("p");
                description.textContent = certificate.description;
                content.appendChild(description);
            }

            var actions = document.createElement("div");
            actions.className = "admin-certificate-actions";

            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "category-btn admin-delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                removeCustomCertificate(certificate.id);
                renderContainers();
                renderCustomCertificateList(container);
            });
            actions.appendChild(deleteButton);

            content.appendChild(actions);
            item.appendChild(content);
            container.appendChild(item);
        });
    }

    function init() {
        renderContainers();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    document.addEventListener(UPDATE_EVENT, function () {
        renderContainers();
    });

    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEY) {
            renderContainers();
        }
    });

    window.KnowAngadCertificates = {
        baseCertificates: baseCertificates,
        getAllCertificates: getAllCertificates,
        getFeaturedCertificates: getFeaturedCertificates,
        getVisibleCertificates: getVisibleCertificates,
        getCustomCertificates: readCustomCertificates,
        addCustomCertificate: addCustomCertificate,
        removeCustomCertificate: removeCustomCertificate,
        clearCustomCertificates: clearCustomCertificates,
        renderContainers: renderContainers,
        renderCustomCertificateList: renderCustomCertificateList,
        createCertificateId: createCertificateId
    };
})();