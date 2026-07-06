document.addEventListener("DOMContentLoaded", function () {
    if (!window.KnowAngadCertificates || !window.KnowAngadContent) {
        return;
    }

    var authenticated = window.sessionStorage.getItem("angad_admin_authenticated") === "true";
    if (!authenticated) {
        window.location.replace("admin-login.html");
        return;
    }

    var form = document.getElementById("certificate-form");
    var statusEl = document.getElementById("portal-status");
    var listEl = document.getElementById("certificate-admin-list");
    var countEl = document.getElementById("certificate-count");
    var galleryCountEl = document.getElementById("gallery-count");
    var blogCountEl = document.getElementById("blog-count");
    var ctfCountEl = document.getElementById("ctf-count");
    var logoutButton = document.getElementById("portal-logout");
    var clearButton = document.getElementById("clear-certificates");
    var refreshButton = document.getElementById("clear-certificates-inline");
    var imageInput = document.getElementById("certificate-image");
    var titleInput = document.getElementById("certificate-title");
    var organizationInput = document.getElementById("certificate-organization");
    var descriptionInput = document.getElementById("certificate-description");
    var credentialInput = document.getElementById("certificate-link");
    var categoryInput = document.getElementById("certificate-category");
    var previewImage = document.getElementById("certificate-preview-image");
    var previewTitle = document.getElementById("certificate-preview-title");
    var previewDescription = document.getElementById("certificate-preview-description");
    var previewMeta = document.getElementById("certificate-preview-meta");
    var previewLink = document.getElementById("certificate-preview-link");
    var activeObjectUrl = "";

    var galleryForm = document.getElementById("gallery-form");
    var galleryStatusEl = document.getElementById("gallery-status");
    var galleryListEl = document.getElementById("gallery-admin-list");
    var galleryTitleInput = document.getElementById("gallery-title");
    var galleryCaptionInput = document.getElementById("gallery-caption");
    var galleryCategoryInput = document.getElementById("gallery-category");
    var galleryImageInput = document.getElementById("gallery-image");
    var galleryLinkInput = document.getElementById("gallery-link");
        var galleryFeaturedInput = document.getElementById("gallery-featured");
    var galleryPreviewImage = document.getElementById("gallery-preview-image");
    var galleryPreviewTitle = document.getElementById("gallery-preview-title");
    var galleryPreviewMeta = document.getElementById("gallery-preview-meta");
    var galleryPreviewCaption = document.getElementById("gallery-preview-caption");
    var galleryPreviewLink = document.getElementById("gallery-preview-link");
    var galleryClearButton = document.getElementById("clear-gallery");
    var galleryRefreshButton = document.getElementById("refresh-gallery");
    var galleryActiveObjectUrl = "";

    var blogForm = document.getElementById("blog-form");
    var blogStatusEl = document.getElementById("blog-status");
    var blogListEl = document.getElementById("blog-admin-list");
    var blogTitleInput = document.getElementById("blog-title");
    var blogExcerptInput = document.getElementById("blog-excerpt");
    var blogContentInput = document.getElementById("blog-content");
    var blogImageInput = document.getElementById("blog-image");
    var blogImageAltInput = document.getElementById("blog-image-alt");
    var blogDateInput = document.getElementById("blog-date");
        var blogFeaturedInput = document.getElementById("blog-featured");
    var blogPreviewImage = document.getElementById("blog-preview-image");
    var blogPreviewTitle = document.getElementById("blog-preview-title");
    var blogPreviewMeta = document.getElementById("blog-preview-meta");
    var blogPreviewExcerpt = document.getElementById("blog-preview-excerpt");
    var blogPreviewContent = document.getElementById("blog-preview-content");
    var blogClearButton = document.getElementById("clear-blog");
    var blogRefreshButton = document.getElementById("refresh-blog");
    var blogActiveObjectUrl = "";

    var ctfForm = document.getElementById("ctf-form");
    var ctfStatusEl = document.getElementById("ctf-status");
    var ctfListEl = document.getElementById("ctf-admin-list");
    var ctfTitleInput = document.getElementById("ctf-title");
    var ctfDifficultyInput = document.getElementById("ctf-difficulty");
    var ctfDescriptionInput = document.getElementById("ctf-description");
    var ctfResourceDescriptionInput = document.getElementById("ctf-resource-description");
    var ctfResourceUrlInput = document.getElementById("ctf-resource-url");
    var ctfFlagInput = document.getElementById("ctf-flag");
        var ctfFeaturedInput = document.getElementById("ctf-featured");
    var ctfPreviewTitle = document.getElementById("ctf-preview-title");
    var ctfPreviewMeta = document.getElementById("ctf-preview-meta");
    var ctfPreviewDescription = document.getElementById("ctf-preview-description");
    var ctfPreviewResource = document.getElementById("ctf-preview-resource");
    var ctfClearButton = document.getElementById("clear-ctf");
    var ctfRefreshButton = document.getElementById("refresh-ctf");
    var exportButton = document.getElementById("portal-export");
    var REPO_SNAPSHOT_KEY = "know_angad_repo_snapshot_v1";

    function downloadJson(filename, data) {
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        var objectUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");

        link.href = objectUrl;
        link.download = filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(function () {
            URL.revokeObjectURL(objectUrl);
        }, 1000);
    }

    function collectCustomItems(allItems, baseItems) {
        var baseIds = {};

        (Array.isArray(baseItems) ? baseItems : []).forEach(function (item) {
            if (item && item.id) {
                baseIds[item.id] = true;
            }
        });

        return (Array.isArray(allItems) ? allItems : []).filter(function (item) {
            return item && (!item.id || !baseIds[item.id] || item.source === "custom");
        });
    }

    function buildExportPayload() {
        var allCertificates = window.KnowAngadCertificates.getAllCertificates();
        var allGalleryItems = window.KnowAngadContent.getAllGalleryItems();
        var allBlogPosts = window.KnowAngadContent.getAllBlogPosts();
        var allCtfChallenges = window.KnowAngadContent.getAllCtfChallenges();

        return {
            exportedAt: new Date().toISOString(),
            certificates: {
                base: window.KnowAngadCertificates.baseCertificates,
                custom: collectCustomItems(allCertificates, window.KnowAngadCertificates.baseCertificates),
                all: allCertificates
            },
            gallery: {
                base: window.KnowAngadContent.baseGalleryItems,
                custom: collectCustomItems(allGalleryItems, window.KnowAngadContent.baseGalleryItems),
                all: allGalleryItems
            },
            blog: {
                base: window.KnowAngadContent.baseBlogPosts,
                custom: collectCustomItems(allBlogPosts, window.KnowAngadContent.baseBlogPosts),
                all: allBlogPosts
            },
            ctf: {
                base: window.KnowAngadContent.baseCtfChallenges,
                custom: collectCustomItems(allCtfChallenges, window.KnowAngadContent.baseCtfChallenges),
                all: allCtfChallenges,
                solved: window.KnowAngadContent.getSolvedCtfChallenges()
            }
        };
    }

    function saveRepoSnapshot() {
        if (!window.KnowAngadCertificates || !window.KnowAngadContent) {
            return;
        }

        try {
            window.localStorage.setItem(REPO_SNAPSHOT_KEY, JSON.stringify(buildExportPayload()));
        } catch (error) {
            try {
                window[REPO_SNAPSHOT_KEY] = JSON.stringify(buildExportPayload());
            } catch (fallbackError) {
                // noop
            }
        }
    }

    document.addEventListener("know-angad:repo-loaded", saveRepoSnapshot);
    document.addEventListener("know-angad:content-updated", saveRepoSnapshot);
    document.addEventListener("know-angad:certificates-updated", saveRepoSnapshot);

    function setStatusElement(element, message, isError) {
        if (!element) {
            return;
        }

        element.textContent = message;
        element.className = isError ? "portal-status error" : "portal-status success";
    }

    function setCertificateStatus(message, isError) {
        setStatusElement(statusEl, message, isError);
    }

    function setGalleryStatus(message, isError) {
        setStatusElement(galleryStatusEl, message, isError);
    }

    function setBlogStatus(message, isError) {
        setStatusElement(blogStatusEl, message, isError);
    }

    function setCtfStatus(message, isError) {
        setStatusElement(ctfStatusEl, message, isError);
    }

    function updatePreviewText() {
        previewTitle.textContent = titleInput.value.trim() || "Certificate title";
        previewDescription.textContent = descriptionInput.value.trim() || "Add a short description to preview the card.";
        previewMeta.textContent = (organizationInput.value.trim() || "Issuing organization") + " - " + categoryInput.value;
        previewLink.href = credentialInput.value.trim() || "#";
    }

    function updateGalleryPreviewText() {
        galleryPreviewTitle.textContent = galleryTitleInput.value.trim() || "Image title";
        galleryPreviewCaption.textContent = galleryCaptionInput.value.trim() || "Add a caption to preview the card.";
        galleryPreviewMeta.textContent = (galleryCategoryInput.value || "event") + " - gallery";
        galleryPreviewLink.href = galleryLinkInput.value.trim() || "#";
    }

    function updateGalleryPreviewImage(file) {
        if (galleryActiveObjectUrl) {
            URL.revokeObjectURL(galleryActiveObjectUrl);
            galleryActiveObjectUrl = "";
        }

        if (!file) {
            galleryPreviewImage.removeAttribute("src");
            return;
        }

        galleryActiveObjectUrl = URL.createObjectURL(file);
        galleryPreviewImage.src = galleryActiveObjectUrl;
    }

    function updateBlogPreviewText() {
        blogPreviewTitle.textContent = blogTitleInput.value.trim() || "Post title";
        blogPreviewExcerpt.textContent = blogExcerptInput.value.trim() || "Add an excerpt to preview the card.";
        blogPreviewContent.textContent = blogContentInput.value.trim() || "Add the post content to preview the card.";
        blogPreviewMeta.textContent = (blogDateInput.value.trim() || "Growing") + " • blog";
    }

    function updateBlogPreviewImage(file) {
        if (blogActiveObjectUrl) {
            URL.revokeObjectURL(blogActiveObjectUrl);
            blogActiveObjectUrl = "";
        }

        if (!file) {
            blogPreviewImage.removeAttribute("src");
            return;
        }

        blogActiveObjectUrl = URL.createObjectURL(file);
        blogPreviewImage.src = blogActiveObjectUrl;
    }

    function updateCtfPreviewText() {
        ctfPreviewTitle.textContent = ctfTitleInput.value.trim() || "Challenge title";
        ctfPreviewMeta.textContent = (ctfDifficultyInput.value || "easy") + " - challenge";
        ctfPreviewDescription.textContent = ctfDescriptionInput.value.trim() || "Add a description to preview the challenge card.";
        ctfPreviewResource.textContent = ctfResourceDescriptionInput.value.trim() || "Add resource notes here.";
    }

    function setCountValues() {
        countEl.textContent = String(window.KnowAngadCertificates.getCustomCertificates().length);
        if (galleryCountEl) {
            galleryCountEl.textContent = String(window.KnowAngadContent.getCustomGalleryItems().length);
        }
        if (blogCountEl) {
            blogCountEl.textContent = String(window.KnowAngadContent.getCustomBlogPosts().length);
        }
        if (ctfCountEl) {
            ctfCountEl.textContent = String(window.KnowAngadContent.getCustomCtfChallenges().length);
        }
    }

    function updatePreviewImage(file) {
        if (activeObjectUrl) {
            URL.revokeObjectURL(activeObjectUrl);
            activeObjectUrl = "";
        }

        if (!file) {
            previewImage.removeAttribute("src");
            return;
        }

        activeObjectUrl = URL.createObjectURL(file);
        previewImage.src = activeObjectUrl;
    }

    function renderList() {
        var certificates = window.KnowAngadCertificates.getCustomCertificates();
        countEl.textContent = String(certificates.length);
        listEl.innerHTML = "";

        if (certificates.length === 0) {
            var empty = document.createElement("p");
            empty.className = "admin-empty-state";
            empty.textContent = "No custom certificates saved yet.";
            listEl.appendChild(empty);
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

            var heading = document.createElement("h3");
            heading.textContent = certificate.title;
            content.appendChild(heading);

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
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                window.KnowAngadCertificates.removeCustomCertificate(certificate.id);
                renderList();
            });
            actions.appendChild(deleteButton);

            content.appendChild(actions);
            item.appendChild(content);
            listEl.appendChild(item);
        });
    }

    function renderGalleryList() {
        if (!galleryListEl) {
            return;
        }

        var items = window.KnowAngadContent.getCustomGalleryItems();
        galleryListEl.innerHTML = "";

        if (items.length === 0) {
            var empty = document.createElement("p");
            empty.className = "admin-empty-state";
            empty.textContent = "No custom gallery images saved yet.";
            galleryListEl.appendChild(empty);
            return;
        }

        items.forEach(function (item) {
            var row = document.createElement("article");
            row.className = "admin-content-list-item";

            var image = document.createElement("img");
            image.src = item.imageSrc;
            image.alt = item.imageAlt || item.title;
            image.loading = "lazy";
            row.appendChild(image);

            var content = document.createElement("div");

            var heading = document.createElement("h3");
            heading.textContent = item.title;
            content.appendChild(heading);

            var meta = document.createElement("p");
            meta.className = "admin-content-meta";
            meta.textContent = [item.category, item.link].filter(Boolean).join(" - ");
            content.appendChild(meta);

            if (item.caption) {
                var caption = document.createElement("p");
                caption.textContent = item.caption;
                content.appendChild(caption);
            }

            var actions = document.createElement("div");
            actions.className = "admin-content-actions";

            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                window.KnowAngadContent.removeCustomGalleryItem(item.id);
                renderGalleryList();
                setCountValues();
            });
            actions.appendChild(deleteButton);

            content.appendChild(actions);
            row.appendChild(content);
            galleryListEl.appendChild(row);
        });
    }

    function renderBlogList() {
        if (!blogListEl) {
            return;
        }

        var items = window.KnowAngadContent.getCustomBlogPosts();
        blogListEl.innerHTML = "";

        if (items.length === 0) {
            var empty = document.createElement("p");
            empty.className = "admin-empty-state";
            empty.textContent = "No custom blog posts saved yet.";
            blogListEl.appendChild(empty);
            return;
        }

        items.forEach(function (item) {
            var row = document.createElement("article");
            row.className = "admin-content-list-item";

            var image = document.createElement("img");
            image.src = item.imageSrc || "image/it/favicon.png";
            image.alt = item.imageAlt || item.title;
            image.loading = "lazy";
            row.appendChild(image);

            var content = document.createElement("div");

            var heading = document.createElement("h3");
            heading.textContent = item.title;
            content.appendChild(heading);

            var meta = document.createElement("p");
            meta.className = "admin-content-meta";
            meta.textContent = [item.date, "blog"].filter(Boolean).join(" - ");
            content.appendChild(meta);

            if (item.excerpt) {
                var excerpt = document.createElement("p");
                excerpt.textContent = item.excerpt;
                content.appendChild(excerpt);
            }

            var actions = document.createElement("div");
            actions.className = "admin-content-actions";

            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                window.KnowAngadContent.removeCustomBlogPost(item.id);
                renderBlogList();
                setCountValues();
            });
            actions.appendChild(deleteButton);

            content.appendChild(actions);
            row.appendChild(content);
            blogListEl.appendChild(row);
        });
    }

    function renderCtfList() {
        if (!ctfListEl) {
            return;
        }

        window.KnowAngadContent.renderCustomCtfList(ctfListEl);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            window.sessionStorage.removeItem("angad_admin_authenticated");
            window.location.href = "admin-login.html";
        });
    }

    if (exportButton) {
        exportButton.addEventListener("click", function () {
            var exportPayload = buildExportPayload();
            downloadJson("content-data.json", exportPayload);
            saveRepoSnapshot();
            setCertificateStatus("Content exported as JSON.", false);
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", function () {
            window.KnowAngadCertificates.clearCustomCertificates();
            renderList();
            setCertificateStatus("Custom certificates cleared.", false);
            setCountValues();
        });
    }

    if (refreshButton) {
        refreshButton.addEventListener("click", function () {
            renderList();
            setCertificateStatus("Certificate list refreshed.", false);
        });
    }

    if (galleryClearButton) {
        galleryClearButton.addEventListener("click", function () {
            window.KnowAngadContent.clearCustomGalleryItems();
            renderGalleryList();
            setGalleryStatus("Gallery images cleared.", false);
            setCountValues();
        });
    }

    if (galleryRefreshButton) {
        galleryRefreshButton.addEventListener("click", function () {
            renderGalleryList();
            setGalleryStatus("Gallery list refreshed.", false);
        });
    }

    if (blogClearButton) {
        blogClearButton.addEventListener("click", function () {
            window.KnowAngadContent.clearCustomBlogPosts();
            renderBlogList();
            setBlogStatus("Blog posts cleared.", false);
            setCountValues();
        });
    }

    if (blogRefreshButton) {
        blogRefreshButton.addEventListener("click", function () {
            renderBlogList();
            setBlogStatus("Blog list refreshed.", false);
        });
    }

    if (ctfClearButton) {
        ctfClearButton.addEventListener("click", function () {
            window.KnowAngadContent.clearCustomCtfChallenges();
            renderCtfList();
            setCtfStatus("CTF challenges cleared.", false);
            setCountValues();
        });
    }

    if (ctfRefreshButton) {
        ctfRefreshButton.addEventListener("click", function () {
            renderCtfList();
            setCtfStatus("CTF list refreshed.", false);
        });
    }

    if (imageInput) {
        imageInput.addEventListener("change", function () {
            updatePreviewImage(this.files && this.files[0] ? this.files[0] : null);
        });
    }

    if (galleryImageInput) {
        galleryImageInput.addEventListener("change", function () {
            updateGalleryPreviewImage(this.files && this.files[0] ? this.files[0] : null);
        });
    }

    if (blogImageInput) {
        blogImageInput.addEventListener("change", function () {
            updateBlogPreviewImage(this.files && this.files[0] ? this.files[0] : null);
        });
    }

    [ctfTitleInput, ctfDifficultyInput, ctfDescriptionInput, ctfResourceDescriptionInput, ctfResourceUrlInput].forEach(function (input) {
        input.addEventListener("input", updateCtfPreviewText);
        input.addEventListener("change", updateCtfPreviewText);
    });

    [titleInput, organizationInput, descriptionInput, credentialInput, categoryInput].forEach(function (input) {
        input.addEventListener("input", updatePreviewText);
        input.addEventListener("change", updatePreviewText);
    });

    [galleryTitleInput, galleryCaptionInput, galleryCategoryInput, galleryLinkInput].forEach(function (input) {
        input.addEventListener("input", updateGalleryPreviewText);
        input.addEventListener("change", updateGalleryPreviewText);
    });

    [blogTitleInput, blogExcerptInput, blogContentInput, blogDateInput].forEach(function (input) {
        input.addEventListener("input", updateBlogPreviewText);
        input.addEventListener("change", updateBlogPreviewText);
    });

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var file = imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;

            if (!file) {
                setCertificateStatus("Please choose a certificate image.", true);
                return;
            }

            if (!titleInput.value.trim() || !descriptionInput.value.trim()) {
                setCertificateStatus("Title and description are required.", true);
                return;
            }

            var reader = new FileReader();
            reader.onload = function () {
                window.KnowAngadCertificates.addCustomCertificate({
                    id: window.KnowAngadCertificates.createCertificateId(),
                    category: categoryInput.value || "course",
                    title: titleInput.value.trim(),
                    imageSrc: String(reader.result || ""),
                    imageAlt: titleInput.value.trim() + " certificate",
                    link: credentialInput.value.trim(),
                    organization: organizationInput.value.trim(),
                    description: descriptionInput.value.trim(),
                    details: [
                        { label: "Description", value: descriptionInput.value.trim() },
                        { label: "Issuing Organization", value: organizationInput.value.trim() }
                    ],
                    source: "custom"
                });

                form.reset();
                updatePreviewText();
                updatePreviewImage(null);
                renderList();
                setCertificateStatus("Certificate published successfully.", false);
            };

            reader.onerror = function () {
                setCertificateStatus("Unable to read the selected image.", true);
            };

            reader.readAsDataURL(file);
        });
    }

    if (galleryForm) {
        galleryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var file = galleryImageInput.files && galleryImageInput.files[0] ? galleryImageInput.files[0] : null;

            if (!file) {
                setGalleryStatus("Please choose a gallery image.", true);
                return;
            }

            if (!galleryTitleInput.value.trim()) {
                setGalleryStatus("Gallery title is required.", true);
                return;
            }

            var reader = new FileReader();
            reader.onload = function () {
                window.KnowAngadContent.addCustomGalleryItem({
                    id: window.KnowAngadContent.createGalleryId(),
                    title: galleryTitleInput.value.trim(),
                    caption: galleryCaptionInput.value.trim(),
                    category: galleryCategoryInput.value || "event",
                    imageSrc: String(reader.result || ""),
                    imageAlt: galleryTitleInput.value.trim(),
                    link: galleryLinkInput.value.trim(),
                    featured: Boolean(galleryFeaturedInput && galleryFeaturedInput.checked),
                    source: "custom"
                });

                galleryForm.reset();
                updateGalleryPreviewText();
                updateGalleryPreviewImage(null);
                renderGalleryList();
                setCountValues();
                setGalleryStatus("Gallery image published successfully.", false);
            };

            reader.onerror = function () {
                setGalleryStatus("Unable to read the selected gallery image.", true);
            };

            reader.readAsDataURL(file);
        });
    }

    if (blogForm) {
        blogForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!blogTitleInput.value.trim() || !blogContentInput.value.trim()) {
                setBlogStatus("Blog title and content are required.", true);
                return;
            }

            var file = blogImageInput.files && blogImageInput.files[0] ? blogImageInput.files[0] : null;
            var publishBlogPost = function (imageSrc) {
                window.KnowAngadContent.addCustomBlogPost({
                    id: window.KnowAngadContent.createBlogId(),
                    title: blogTitleInput.value.trim(),
                    excerpt: blogExcerptInput.value.trim(),
                    content: blogContentInput.value.trim(),
                    imageSrc: imageSrc || "",
                    imageAlt: blogImageAltInput.value.trim() || blogTitleInput.value.trim(),
                    date: blogDateInput.value.trim() || new Date().toISOString().slice(0, 10),
                    featured: Boolean(blogFeaturedInput && blogFeaturedInput.checked),
                    source: "custom"
                });

                blogForm.reset();
                updateBlogPreviewText();
                updateBlogPreviewImage(null);
                renderBlogList();
                setCountValues();
                setBlogStatus("Blog post published successfully.", false);
            };

            if (!file) {
                publishBlogPost("");
                return;
            }

            var reader = new FileReader();
            reader.onload = function () {
                publishBlogPost(String(reader.result || ""));
            };

            reader.onerror = function () {
                setBlogStatus("Unable to read the selected blog image.", true);
            };

            reader.readAsDataURL(file);
        });
    }

    if (ctfForm) {
        ctfForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!ctfTitleInput.value.trim() || !ctfDescriptionInput.value.trim() || !ctfResourceDescriptionInput.value.trim() || !ctfFlagInput.value.trim()) {
                setCtfStatus("Title, description, resource description, and flag are required.", true);
                return;
            }

            try {
                window.KnowAngadContent.addCustomCtfChallenge({
                    id: window.KnowAngadContent.createCtfId(),
                    title: ctfTitleInput.value.trim(),
                    difficulty: ctfDifficultyInput.value || "easy",
                    description: ctfDescriptionInput.value.trim(),
                    resourceDescription: ctfResourceDescriptionInput.value.trim(),
                    resourceUrl: ctfResourceUrlInput.value.trim(),
                    flag: ctfFlagInput.value.trim(),
                    featured: Boolean(ctfFeaturedInput && ctfFeaturedInput.checked),
                    source: "custom"
                });

                ctfForm.reset();
                updateCtfPreviewText();
                renderCtfList();
                setCountValues();
                setCtfStatus("CTF challenge published successfully.", false);
            } catch (error) {
                setCtfStatus(error && error.message ? error.message : "Unable to publish challenge.", true);
            }
        });
    }

    updatePreviewText();
    updateGalleryPreviewText();
    updateBlogPreviewText();
    updateCtfPreviewText();
    renderList();
    renderGalleryList();
    renderBlogList();
    renderCtfList();
    setCountValues();

    if (window.KnowAngadRepoData) {
        saveRepoSnapshot();
    }
});