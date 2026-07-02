(function () {
    var GALLERY_STORAGE_KEY = "know_angad_custom_gallery_v1";
    var BLOG_STORAGE_KEY = "know_angad_custom_blog_v1";
    var CTF_STORAGE_KEY = "know_angad_custom_ctf_v1";
    var CTF_SOLVED_KEY = "know_angad_ctf_solved_v1";
    var CONTENT_DATA_URL = "content-data.json";
    var CONTENT_UPDATE_EVENT = "know-angad:content-updated";
    var GALLERY_UPDATE_EVENT = "know-angad:gallery-updated";
    var BLOG_UPDATE_EVENT = "know-angad:blog-updated";
    var CTF_UPDATE_EVENT = "know-angad:ctf-updated";
    var repoContent = null;
    var repoContentPromise = null;

    var baseGalleryItems = [
        {
            id: "base-gallery-u-tec",
            title: "U-tec Hackathon",
            featured: true,
            imageSrc: "image/participation/team.jpg",
            imageAlt: "Team photo at U-tec Beta Hackathon 2024",
            link: "image/participation/team.jpg"
        },
        {
            id: "base-gallery-it-quiz",
            title: "IT Quiz 2024 / Forbes",
            imageSrc: "image/participation/quiz.jpg",
            imageAlt: "IT Quiz 2024 at Forbes College",
            link: "image/participation/quiz.jpg"
        },
        {
            id: "base-gallery-presentation-mania",
            title: "Presentation Mania winners",
            imageSrc: "image/participation/prmania.jpeg",
            imageAlt: "Presentation Mania winners",
            link: "image/participation/prmania.jpeg"
        },
        {
            id: "base-gallery-ccsa-team",
            title: "CCCSA Team 2026",
            featured: true,
            imageSrc: "image/participation/forbesccsateam.jpeg",
            imageAlt: "CCCSA team during 2026",
            link: "image/participation/forbesccsateam.jpeg"
        }
    ];

    var baseBlogPosts = [
        {
            id: "base-blog-random-thoughts",
            title: "Random Thoughts & Reflections",
            featured: true,
            excerpt: "Raw reflections, unfiltered thinking, and honest musings about tech, life, and everything in between.",
            content: [
                "Every thought has its place. Sometimes the most random ideas spark the best conversations or creations.",
                "This space is for raw reflections, unfiltered thinking, and honest musings about tech, life, and everything in between."
            ],
            date: "Growing"
        },
        {
            id: "base-blog-cyber-journey",
            title: "Journey Into Cybersecurity",
            featured: true,
            excerpt: "How I started my journey into cybersecurity and built a mindset around digital defense.",
            content: [
                "How I started my journey into cybersecurity — from curiosity about how things work to learning about network vulnerabilities, ethical hacking, and building a mindset around digital defense.",
                "More detailed write-ups coming soon!"
            ],
            date: "Growing"
        }
    ];

    var baseCtfChallenges = [
        {
            id: "base-ctf-third-flag",
            title: "3rd Flag Recovery",
            featured: true,
            difficulty: "easy",
            description: "A lightweight reverse-style challenge built around a hidden note in the portfolio trail.",
            resourceDescription: "Inspect the static portfolio pages and connect the encoded trail with the challenge prompt.",
            resourceUrl: "index.html",
            flagHash: "b9704a1872efad09b18b6bc1c33858dd737106a5a45ac48152b8049f6d446c2a"
        },
        {
            id: "base-ctf-network-sight",
            title: "Network Sight",
            featured: true,
            difficulty: "medium",
            description: "A clue trail that rewards reading carefully instead of brute forcing.",
            resourceDescription: "Use the public pages, their source, and the hidden clues to identify the final flag.",
            resourceUrl: "certificate.html",
            flagHash: "7c1c944578328537cd42f33ff48d52e5d0c2bc05b0ce5cf28e9b969563a90e0f"
        },
        {
            id: "base-ctf-black-box",
            title: "Black Box Lab",
            difficulty: "hard",
            description: "A more obscure challenge meant to mimic a closed-box investigation.",
            resourceDescription: "Trace the portfolio layout, inspect the static assets, and reconstruct the clue chain.",
            resourceUrl: "gallery.html",
            flagHash: "ccfcb1e320b5c31520f313c1138ea78881d8ae03d624ee0beaf7f520dee6ec3bd"
        }
    ];

    function canUseStorage() {
        try {
            var testKey = "__know_angad_content_storage_test__";
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    function readStoredItems(storageKey) {
        try {
            var rawValue = canUseStorage() ? window.localStorage.getItem(storageKey) : window[storageKey];
            var parsedValue = rawValue ? JSON.parse(rawValue) : [];
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch (error) {
            return [];
        }
    }

    function writeStoredItems(storageKey, items, eventName) {
        if (canUseStorage()) {
            window.localStorage.setItem(storageKey, JSON.stringify(items));
        } else {
            window[storageKey] = JSON.stringify(items);
        }

        document.dispatchEvent(new CustomEvent(CONTENT_UPDATE_EVENT, { detail: { type: eventName } }));
        document.dispatchEvent(new CustomEvent(eventName));
    }

    function createId(prefix) {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return prefix + "-" + window.crypto.randomUUID();
        }

        return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    }

    function hashFlagValue(flag) {
        if (typeof sha3_256 !== "function") {
            throw new Error("SHA3 hashing is unavailable.");
        }

        return sha3_256(String(flag));
    }

    function cloneList(items) {
        return Array.isArray(items) ? items.slice() : [];
    }

    function applyBaseDefaults(items, defaults) {
        var defaultsById = {};
        cloneList(defaults).forEach(function (defaultItem) {
            defaultsById[defaultItem.id] = defaultItem;
        });

        return cloneList(items).map(function (item) {
            var fallback = defaultsById[item.id] || {};
            return Object.assign({}, fallback, item);
        });
    }

    function cloneList(items) {
        return Array.isArray(items) ? items.slice() : [];
    }

    function normalizeRepoSection(section, fallbackBase) {
        var normalizedBase = applyBaseDefaults(section && section.base ? section.base : fallbackBase, fallbackBase);
        var normalizedCustom = cloneList(section && section.custom ? section.custom : []);
        var normalizedAll = cloneList(section && section.all ? section.all : normalizedBase.concat(normalizedCustom));

        return {
            base: normalizedBase,
            custom: normalizedCustom,
            all: normalizedAll
        };
    }

    function setRepoContent(data) {
        repoContent = {
            exportedAt: data && data.exportedAt ? data.exportedAt : null,
            certificates: normalizeRepoSection(data && data.certificates, baseCertificates),
            gallery: normalizeRepoSection(data && data.gallery, baseGalleryItems),
            blog: normalizeRepoSection(data && data.blog, baseBlogPosts),
            ctf: normalizeRepoSection(data && data.ctf, baseCtfChallenges)
        };
    }

    function loadRepoContent() {
        if (repoContentPromise) {
            return repoContentPromise;
        }

        if (window.KnowAngadRepoPromise && typeof window.KnowAngadRepoPromise.then === "function") {
            repoContentPromise = window.KnowAngadRepoPromise.then(function (data) {
                if (data && !repoContent) {
                    setRepoContent(data);
                }

                return repoContent;
            });

            return repoContentPromise;
        }

        if (typeof fetch !== "function") {
            repoContentPromise = Promise.resolve(null);
            return repoContentPromise;
        }

        repoContentPromise = fetch(CONTENT_DATA_URL, { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Unable to load content data.");
                }

                return response.json();
            })
            .then(function (data) {
                setRepoContent(data);
                document.dispatchEvent(new CustomEvent(CONTENT_UPDATE_EVENT));
                document.dispatchEvent(new CustomEvent("know-angad:repo-loaded", { detail: data }));
                return repoContent;
            })
            .catch(function () {
                repoContent = null;
                document.dispatchEvent(new CustomEvent("know-angad:repo-load-failed"));
                return null;
            });

        return repoContentPromise;
    }

    function ensureImageLightbox() {
        var existingLightbox = document.getElementById("content-image-lightbox");
        if (existingLightbox) {
            return existingLightbox;
        }

        var lightbox = document.createElement("div");
        lightbox.id = "content-image-lightbox";
        lightbox.className = "image-lightbox";
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.innerHTML =
            '<div class="image-lightbox-backdrop" data-lightbox-close></div>' +
            '<div class="image-lightbox-panel" role="dialog" aria-modal="true" aria-label="Expanded image preview">' +
                '<button type="button" class="image-lightbox-close" aria-label="Close image preview" data-lightbox-close>&times;</button>' +
                '<img class="image-lightbox-image" alt="Expanded preview">' +
                '<div class="image-lightbox-meta">' +
                    '<p class="image-lightbox-title"></p>' +
                    '<a class="image-lightbox-link" target="_blank" rel="noopener">Open original</a>' +
                '</div>' +
            '</div>';

        document.body.appendChild(lightbox);

        lightbox.addEventListener("click", function (event) {
            if (event.target && event.target.hasAttribute("data-lightbox-close")) {
                closeImageLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeImageLightbox();
            }
        });

        return lightbox;
    }

    function openImageLightbox(imageSrc, title, linkHref) {
        var lightbox = ensureImageLightbox();
        var image = lightbox.querySelector(".image-lightbox-image");
        var titleEl = lightbox.querySelector(".image-lightbox-title");
        var linkEl = lightbox.querySelector(".image-lightbox-link");

        image.src = imageSrc;
        image.alt = title || "Expanded image preview";
        titleEl.textContent = title || "Expanded image preview";
        linkEl.href = linkHref || imageSrc;
        linkEl.style.display = linkHref ? "inline-flex" : "none";

        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
    }

    function closeImageLightbox() {
        var lightbox = document.getElementById("content-image-lightbox");
        if (!lightbox) {
            return;
        }

        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
    }

    function getCustomGalleryItems() {
        return readStoredItems(GALLERY_STORAGE_KEY);
    }

    function getCustomBlogPosts() {
        return readStoredItems(BLOG_STORAGE_KEY);
    }

    function getCustomCtfChallenges() {
        return readStoredItems(CTF_STORAGE_KEY);
    }

    function getSolvedCtfChallenges() {
        return readStoredItems(CTF_SOLVED_KEY);
    }

    function getAllGalleryItems() {
        if (repoContent && repoContent.gallery) {
            return cloneList(repoContent.gallery.all);
        }

        return getCustomGalleryItems().concat(baseGalleryItems);
    }

    function getFeaturedGalleryItems() {
        return getAllGalleryItems().filter(function (item) {
            return Boolean(item.featured);
        });
    }

    function getAllBlogPosts() {
        if (repoContent && repoContent.blog) {
            return cloneList(repoContent.blog.all);
        }

        return getCustomBlogPosts().concat(baseBlogPosts);
    }

    function getFeaturedBlogPosts() {
        return getAllBlogPosts().filter(function (post) {
            return Boolean(post.featured);
        });
    }

    function getAllCtfChallenges() {
        if (repoContent && repoContent.ctf) {
            return cloneList(repoContent.ctf.all);
        }

        return baseCtfChallenges.concat(getCustomCtfChallenges());
    }

    function getFeaturedCtfChallenges() {
        return getAllCtfChallenges().filter(function (challenge) {
            return Boolean(challenge.featured);
        });
    }

    function addCustomGalleryItem(item) {
        var items = getCustomGalleryItems();
        items.unshift(Object.assign({ featured: false }, item));
        writeStoredItems(GALLERY_STORAGE_KEY, items, GALLERY_UPDATE_EVENT);
        return item;
    }

    function removeCustomGalleryItem(id) {
        var items = getCustomGalleryItems().filter(function (item) {
            return item.id !== id;
        });

        writeStoredItems(GALLERY_STORAGE_KEY, items, GALLERY_UPDATE_EVENT);
    }

    function clearCustomGalleryItems() {
        writeStoredItems(GALLERY_STORAGE_KEY, [], GALLERY_UPDATE_EVENT);
    }

    function addCustomBlogPost(post) {
        var items = getCustomBlogPosts();
        items.unshift(Object.assign({ featured: false }, post));
        writeStoredItems(BLOG_STORAGE_KEY, items, BLOG_UPDATE_EVENT);
        return post;
    }

    function removeCustomBlogPost(id) {
        var items = getCustomBlogPosts().filter(function (post) {
            return post.id !== id;
        });

        writeStoredItems(BLOG_STORAGE_KEY, items, BLOG_UPDATE_EVENT);
    }

    function clearCustomBlogPosts() {
        writeStoredItems(BLOG_STORAGE_KEY, [], BLOG_UPDATE_EVENT);
    }

    function addCustomCtfChallenge(challenge) {
        var items = getCustomCtfChallenges();
        items.unshift({
            id: challenge.id || createId("ctf"),
            title: challenge.title,
            difficulty: challenge.difficulty || "easy",
            description: challenge.description || "",
            resourceDescription: challenge.resourceDescription || "",
            resourceUrl: challenge.resourceUrl || "",
            featured: Boolean(challenge.featured),
            flagHash: challenge.flagHash || hashFlagValue(challenge.flag),
            source: "custom"
        });
        writeStoredItems(CTF_STORAGE_KEY, items, CTF_UPDATE_EVENT);
        return items[0];
    }

    function removeCustomCtfChallenge(id) {
        var items = getCustomCtfChallenges().filter(function (challenge) {
            return challenge.id !== id;
        });

        writeStoredItems(CTF_STORAGE_KEY, items, CTF_UPDATE_EVENT);

        var solvedChallenges = getSolvedCtfChallenges().filter(function (challengeId) {
            return challengeId !== id;
        });

        writeStoredItems(CTF_SOLVED_KEY, solvedChallenges, CTF_UPDATE_EVENT);
    }

    function clearCustomCtfChallenges() {
        writeStoredItems(CTF_STORAGE_KEY, [], CTF_UPDATE_EVENT);
        writeStoredItems(CTF_SOLVED_KEY, [], CTF_UPDATE_EVENT);
    }

    function isCtfSolved(id) {
        return getSolvedCtfChallenges().indexOf(id) !== -1;
    }

    function markCtfSolved(id) {
        var solvedChallenges = getSolvedCtfChallenges();
        if (solvedChallenges.indexOf(id) === -1) {
            solvedChallenges.push(id);
            writeStoredItems(CTF_SOLVED_KEY, solvedChallenges, CTF_UPDATE_EVENT);
        }
    }

    function submitCtfFlag(challengeId, flagValue) {
        var challenge = getAllCtfChallenges().filter(function (item) {
            return item.id === challengeId;
        })[0];

        if (!challenge) {
            return { success: false, message: "Challenge not found." };
        }

        var submittedHash = hashFlagValue(String(flagValue || "").trim());
        if (submittedHash === challenge.flagHash) {
            markCtfSolved(challengeId);
            document.dispatchEvent(new CustomEvent(CTF_UPDATE_EVENT, { detail: { id: challengeId, solved: true } }));
            return { success: true, message: "Correct flag. Challenge solved." };
        }

        return { success: false, message: "Incorrect flag. Try again." };
    }

    function createGalleryCard(item) {
        var card = document.createElement("article");
        card.className = "gallery-item show";
        card.setAttribute("data-gallery-id", item.id || "");
        if (item.source === "custom") {
            card.setAttribute("data-gallery-source", "custom");
        }

        if (item.featured) {
            var featuredBadge = document.createElement("span");
            featuredBadge.className = "featured-badge";
            featuredBadge.textContent = "Featured";
            card.appendChild(featuredBadge);
        }

        if (item.source === "custom") {
            var badge = document.createElement("span");
            badge.className = "gallery-badge";
            badge.textContent = "Admin Added";
            card.appendChild(badge);
        }

        var link = document.createElement("a");
        var destination = item.link || item.imageSrc;
        link.href = destination;
        if (/^https?:\/\//i.test(destination)) {
            link.target = "_blank";
            link.rel = "noopener";
        }

        var image = document.createElement("img");
        image.src = item.imageSrc;
        image.alt = item.imageAlt || item.title;
        image.loading = "lazy";
        image.width = 600;
        image.height = 400;
        link.appendChild(image);
        card.appendChild(link);

        var title = document.createElement("div");
        title.className = "gallery-item-title";
        title.textContent = item.title;
        card.appendChild(title);

        return card;
    }

    function renderGalleryContainers() {
        var containers = document.querySelectorAll("[data-gallery-view]");
        containers.forEach(function (container) {
            var limit = parseInt(container.getAttribute("data-gallery-limit") || "0", 10);
            var view = container.getAttribute("data-gallery-view") || "all";
            var items = view === "featured" ? getFeaturedGalleryItems() : getAllGalleryItems();

            if (!Number.isNaN(limit) && limit > 0) {
                items = items.slice(0, limit);
            }

            container.innerHTML = "";
            items.forEach(function (item) {
                container.appendChild(createGalleryCard(item));
            });
        });
    }

    function normalizeBlogParagraphs(content) {
        if (Array.isArray(content)) {
            return content;
        }

        return String(content || "")
            .split(/\n+/)
            .map(function (paragraph) {
                return paragraph.trim();
            })
            .filter(Boolean);
    }

    function createBlogPostElement(post) {
        var article = document.createElement("article");
        article.className = "vlog-post show";
        article.setAttribute("data-blog-post-id", post.id || "");

        if (post.featured) {
            var featuredBadge = document.createElement("span");
            featuredBadge.className = "featured-badge";
            featuredBadge.textContent = "Featured";
            article.appendChild(featuredBadge);
        }

        var title = document.createElement("h4");
        title.className = "section-title";
        title.textContent = "./" + post.title;
        article.appendChild(title);

        var meta = document.createElement("p");
        meta.className = "blog-post-meta";
        var metaParts = [];
        if (post.date) {
            metaParts.push(String(post.date));
        }
        if (post.source === "custom") {
            metaParts.push("Admin Added");
        }
        meta.textContent = metaParts.join(" • ");
        article.appendChild(meta);

        if (post.imageSrc) {
            var image = document.createElement("img");
            image.className = "blog-post-image";
            image.src = post.imageSrc;
            image.alt = post.imageAlt || post.title;
            image.loading = "lazy"
            ;
            article.appendChild(image);
        }

        if (post.excerpt) {
            var excerpt = document.createElement("p");
            excerpt.className = "blog-post-excerpt";
            excerpt.textContent = post.excerpt;
            article.appendChild(excerpt);
        }

        var content = document.createElement("div");
        content.className = "blog-post-content";
        normalizeBlogParagraphs(post.content).forEach(function (paragraphText) {
            var paragraph = document.createElement("p");
            paragraph.textContent = paragraphText;
            content.appendChild(paragraph);
        });
        article.appendChild(content);

        return article;
    }

    function createBlogTeaserElement(post) {
        var article = document.createElement("article");
        article.className = "blog-teaser-card show";

        if (post.featured) {
            var featuredBadge = document.createElement("span");
            featuredBadge.className = "featured-badge";
            featuredBadge.textContent = "Featured";
            article.appendChild(featuredBadge);
        }

        var title = document.createElement("h3");
        title.textContent = post.title;
        article.appendChild(title);

        if (post.excerpt) {
            var excerpt = document.createElement("p");
            excerpt.textContent = post.excerpt;
            article.appendChild(excerpt);
        }

        if (post.imageSrc) {
            var image = document.createElement("img");
            image.className = "blog-teaser-image";
            image.src = post.imageSrc;
            image.alt = post.imageAlt || post.title;
            image.loading = "lazy";
            article.appendChild(image);
        }

        var link = document.createElement("a");
        link.className = "email-link blog-teaser-link";
        link.href = "blog.html";
        link.textContent = "Read more";
        article.appendChild(link);

        return article;
    }

    function createCtfChallengeElement(challenge) {
        var article = document.createElement("article");
        article.className = "ctf-card show";
        article.setAttribute("data-ctf-id", challenge.id || "");
        article.setAttribute("data-ctf-difficulty", challenge.difficulty || "easy");

        if (challenge.featured) {
            var featuredBadge = document.createElement("span");
            featuredBadge.className = "featured-badge";
            featuredBadge.textContent = "Featured";
            article.appendChild(featuredBadge);
        }

        if (challenge.source === "custom") {
            var badge = document.createElement("span");
            badge.className = "ctf-badge";
            badge.textContent = "Admin Added";
            article.appendChild(badge);
        }

        var difficulty = document.createElement("span");
        difficulty.className = "ctf-difficulty";
        difficulty.textContent = (challenge.difficulty || "easy").toUpperCase();
        article.appendChild(difficulty);

        var title = document.createElement("h3");
        title.textContent = challenge.title;
        article.appendChild(title);

        var description = document.createElement("p");
        description.className = "ctf-description";
        description.textContent = challenge.description || "";
        article.appendChild(description);

        if (challenge.resourceDescription) {
            var resourceDescription = document.createElement("p");
            resourceDescription.className = "ctf-resource-description";
            resourceDescription.textContent = challenge.resourceDescription;
            article.appendChild(resourceDescription);
        }

        if (challenge.resourceUrl) {
            var resourceLink = document.createElement("a");
            resourceLink.className = "ctf-resource-link email-link";
            resourceLink.href = challenge.resourceUrl;
            resourceLink.textContent = "Open resource";
            article.appendChild(resourceLink);
        }

        var solved = isCtfSolved(challenge.id);
        var status = document.createElement("div");
        status.className = solved ? "ctf-status solved" : "ctf-status";
        status.textContent = solved ? "Solved" : "Submit the flag to unlock the challenge.";
        article.appendChild(status);

        if (!solved) {
            var form = document.createElement("form");
            form.className = "ctf-solve-form";

            var input = document.createElement("input");
            input.type = "text";
            input.className = "ctf-flag-input";
            input.placeholder = "Enter flag...";
            input.autocomplete = "off";
            input.spellcheck = false;

            var button = document.createElement("button");
            button.type = "submit";
            button.className = "ctf-submit-btn";
            button.textContent = "Submit Flag";

            form.appendChild(input);
            form.appendChild(button);

            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var result = submitCtfFlag(challenge.id, input.value);
                status.textContent = result.message;
                status.className = result.success ? "ctf-status solved" : "ctf-status error";

                if (result.success) {
                    renderCtfContainers();
                }
            });

            article.appendChild(form);
        }

        return article;
    }

    function createCtfTeaserElement(challenge) {
        var article = document.createElement("article");
        article.className = "ctf-card ctf-teaser-card show";

        if (challenge.featured) {
            var featuredBadge = document.createElement("span");
            featuredBadge.className = "featured-badge";
            featuredBadge.textContent = "Featured";
            article.appendChild(featuredBadge);
        }

        var difficulty = document.createElement("span");
        difficulty.className = "ctf-difficulty";
        difficulty.textContent = (challenge.difficulty || "easy").toUpperCase();
        article.appendChild(difficulty);

        var title = document.createElement("h3");
        title.textContent = challenge.title;
        article.appendChild(title);

        var description = document.createElement("p");
        description.className = "ctf-description";
        description.textContent = challenge.description || "";
        article.appendChild(description);

        var link = document.createElement("a");
        link.className = "email-link";
        link.href = "ctf.html";
        link.textContent = "Open challenge";
        article.appendChild(link);

        return article;
    }

    function renderCtfContainers() {
        var containers = document.querySelectorAll("[data-ctf-view]");
        containers.forEach(function (container) {
            var limit = parseInt(container.getAttribute("data-ctf-limit") || "0", 10);
            var view = container.getAttribute("data-ctf-view") || "all";
            var mode = container.getAttribute("data-content-mode") || "full";
            var challenges = view === "featured" ? getFeaturedCtfChallenges() : getAllCtfChallenges();

            if (!Number.isNaN(limit) && limit > 0) {
                challenges = challenges.slice(0, limit);
            }

            container.innerHTML = "";
            challenges.forEach(function (challenge) {
                container.appendChild(mode === "teaser" ? createCtfTeaserElement(challenge) : createCtfChallengeElement(challenge));
            });
        });
    }

    function renderCustomCtfList(container) {
        if (!container) {
            return;
        }

        var challenges = getCustomCtfChallenges();
        container.innerHTML = "";

        if (challenges.length === 0) {
            var emptyMessage = document.createElement("p");
            emptyMessage.className = "admin-empty-state";
            emptyMessage.textContent = "No custom CTF challenges saved yet.";
            container.appendChild(emptyMessage);
            return;
        }

        challenges.forEach(function (challenge) {
            var item = document.createElement("article");
            item.className = "admin-content-list-item";

            var icon = document.createElement("div");
            icon.className = "admin-ctf-icon";
            icon.textContent = "CTF";
            item.appendChild(icon);

            var content = document.createElement("div");

            var heading = document.createElement("h3");
            heading.textContent = challenge.title;
            content.appendChild(heading);

            var meta = document.createElement("p");
            meta.className = "admin-content-meta";
            meta.textContent = [challenge.difficulty, challenge.resourceUrl].filter(Boolean).join(" - ");
            content.appendChild(meta);

            if (challenge.description) {
                var description = document.createElement("p");
                description.textContent = challenge.description;
                content.appendChild(description);
            }

            var actions = document.createElement("div");
            actions.className = "admin-content-actions";

            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                removeCustomCtfChallenge(challenge.id);
                renderCustomCtfList(container);
                renderCtfContainers();
            });
            actions.appendChild(deleteButton);

            content.appendChild(actions);
            item.appendChild(content);
            container.appendChild(item);
        });
    }

    function renderBlogContainers() {
        var containers = document.querySelectorAll("[data-blog-view]");
        containers.forEach(function (container) {
            var limit = parseInt(container.getAttribute("data-blog-limit") || "0", 10);
            var view = container.getAttribute("data-blog-view") || "all";
            var mode = container.getAttribute("data-content-mode") || "full";
            var posts = view === "featured" ? getFeaturedBlogPosts() : getAllBlogPosts();

            if (!Number.isNaN(limit) && limit > 0) {
                posts = posts.slice(0, limit);
            }

            container.innerHTML = "";
            posts.forEach(function (post) {
                container.appendChild(mode === "teaser" ? createBlogTeaserElement(post) : createBlogPostElement(post));
            });
        });
    }

    function handleImageClicks(event) {
        var galleryLink = event.target.closest(".gallery-item a");
        if (galleryLink) {
            event.preventDefault();
            var galleryImage = galleryLink.querySelector("img");
            openImageLightbox(
                galleryImage ? galleryImage.src : galleryLink.href,
                galleryImage ? galleryImage.alt : "Gallery image",
                galleryLink.href
            );
            return;
        }

        var certificateImage = event.target.closest(".certificate-item img");
        if (certificateImage) {
            var certificateLink = certificateImage.closest("a");
            event.preventDefault();
            openImageLightbox(
                certificateImage.getAttribute("src") || certificateImage.src,
                certificateImage.getAttribute("data-lightbox-title") || certificateImage.alt || "Certificate image",
                certificateImage.getAttribute("data-lightbox-link") || (certificateLink ? certificateLink.href : certificateImage.src)
            );
            return;
        }

        var blogImage = event.target.closest(".blog-post-image");
        if (blogImage) {
            event.preventDefault();
            openImageLightbox(blogImage.src, blogImage.alt || "Blog image", blogImage.src);
        }
    }

    function init() {
        loadRepoContent().then(function () {
            renderGalleryContainers();
            renderBlogContainers();
            renderCtfContainers();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    document.addEventListener("click", handleImageClicks);

    document.addEventListener(CONTENT_UPDATE_EVENT, function (event) {
        if (!event.detail || event.detail.type === GALLERY_UPDATE_EVENT) {
            renderGalleryContainers();
        }

        if (!event.detail || event.detail.type === BLOG_UPDATE_EVENT) {
            renderBlogContainers();
        }

        if (!event.detail || event.detail.type === CTF_UPDATE_EVENT) {
            renderCtfContainers();
        }
    });

    window.addEventListener("storage", function (event) {
        if (event.key === GALLERY_STORAGE_KEY) {
            renderGalleryContainers();
        }

        if (event.key === BLOG_STORAGE_KEY) {
            renderBlogContainers();
        }

        if (event.key === CTF_STORAGE_KEY || event.key === CTF_SOLVED_KEY) {
            renderCtfContainers();
        }
    });

    window.KnowAngadContent = {
        baseGalleryItems: baseGalleryItems,
        baseBlogPosts: baseBlogPosts,
        baseCtfChallenges: baseCtfChallenges,
        getAllGalleryItems: getAllGalleryItems,
        getFeaturedGalleryItems: getFeaturedGalleryItems,
        getAllBlogPosts: getAllBlogPosts,
        getFeaturedBlogPosts: getFeaturedBlogPosts,
        getCustomGalleryItems: getCustomGalleryItems,
        getCustomBlogPosts: getCustomBlogPosts,
        getCustomCtfChallenges: getCustomCtfChallenges,
        getSolvedCtfChallenges: getSolvedCtfChallenges,
        loadRepoContent: loadRepoContent,
        addCustomGalleryItem: addCustomGalleryItem,
        removeCustomGalleryItem: removeCustomGalleryItem,
        clearCustomGalleryItems: clearCustomGalleryItems,
        addCustomBlogPost: addCustomBlogPost,
        removeCustomBlogPost: removeCustomBlogPost,
        clearCustomBlogPosts: clearCustomBlogPosts,
        getAllCtfChallenges: getAllCtfChallenges,
        getFeaturedCtfChallenges: getFeaturedCtfChallenges,
        addCustomCtfChallenge: addCustomCtfChallenge,
        removeCustomCtfChallenge: removeCustomCtfChallenge,
        clearCustomCtfChallenges: clearCustomCtfChallenges,
        submitCtfFlag: submitCtfFlag,
        renderCtfContainers: renderCtfContainers,
        renderCustomCtfList: renderCustomCtfList,
        renderGalleryContainers: renderGalleryContainers,
        renderBlogContainers: renderBlogContainers,
        openImageLightbox: openImageLightbox,
        closeImageLightbox: closeImageLightbox,
        hashFlagValue: hashFlagValue,
        createGalleryId: function () {
            return createId("gallery");
        },
        createBlogId: function () {
            return createId("blog");
        },
        createCtfId: function () {
            return createId("ctf");
        }
    };

    // If another loader (repo-loader.js) supplies repo data, accept it and re-render
    document.addEventListener("know-angad:repo-loaded", function (event) {
        try {
            if (event && event.detail) {
                setRepoContent(event.detail);
                document.dispatchEvent(new CustomEvent(CONTENT_UPDATE_EVENT));
            }
        } catch (e) {
            // ignore
        }
    });

    document.addEventListener("know-angad:repo-load-failed", function () {
        repoContent = null;
        document.dispatchEvent(new CustomEvent(CONTENT_UPDATE_EVENT));
    });
})();