document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // Blog Search & TOC
    // ===========================
    var searchInput = document.getElementById("search-input");
    var tocList = document.getElementById("toc-list");

    function getBlogPosts() {
        return document.querySelectorAll(".vlog-post");
    }

    function rebuildBlogNavigation() {
        var vlogPosts = getBlogPosts();

        if (tocList) {
            tocList.innerHTML = "";
        }

        vlogPosts.forEach(function (post) {
            var titleEl = post.querySelector(".section-title");
            if (!titleEl) return;

            if (tocList) {
                var tocItem = document.createElement("li");
                tocItem.textContent = titleEl.textContent;
                tocItem.addEventListener("click", function () {
                    post.scrollIntoView({ behavior: "smooth" });
                });
                tocList.appendChild(tocItem);
            }
        });
    }

    function applyBlogFilter() {
        var vlogPosts = getBlogPosts();

        if (!searchInput) {
            return;
        }

        var filter = searchInput.value.toLowerCase();
        vlogPosts.forEach(function (post) {
            var titleEl = post.querySelector(".section-title");
            var postText = post.textContent.toLowerCase();
            var title = titleEl ? titleEl.textContent.toLowerCase() : postText;
            post.style.display = title.includes(filter) || postText.includes(filter) ? "" : "none";
        });
    }

    if (tocList || searchInput) {
        rebuildBlogNavigation();
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyBlogFilter);
    }

    document.addEventListener("know-angad:blog-updated", function () {
        rebuildBlogNavigation();
        applyBlogFilter();
    });

    document.addEventListener("know-angad:content-updated", function (event) {
        if (!event.detail || event.detail.type === "know-angad:blog-updated") {
            rebuildBlogNavigation();
            applyBlogFilter();
        }
    });

    if (tocList || searchInput) {
        applyBlogFilter();
    }

    // ===========================
    // Certificate Category Filter
    // ===========================
    var categoryButtons = document.querySelectorAll(".category-btn");

    function applyCertificateFilter(category) {
        var certificateItems = document.querySelectorAll(".certificate-item");

        if (certificateItems.length === 0) {
            return;
        }

        certificateItems.forEach(function (item) {
            if (category === "all" || item.getAttribute("data-category") === category) {
                item.classList.add("show");
            } else {
                item.classList.remove("show");
            }
        });
    }

    if (categoryButtons.length > 0) {
        categoryButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                categoryButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                });
                button.classList.add("active");

                var category = button.getAttribute("data-category");
                applyCertificateFilter(category);
            });
        });

        document.addEventListener("know-angad:certificates-updated", function () {
            var activeButton = document.querySelector(".category-btn.active");
            var activeCategory = activeButton ? activeButton.getAttribute("data-category") : "all";
            applyCertificateFilter(activeCategory);
        });
    }
});
