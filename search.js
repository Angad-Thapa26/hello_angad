document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // Blog Search & TOC
    // ===========================
    var searchInput = document.getElementById("search-input");
    var vlogPosts = document.querySelectorAll(".vlog-post");
    var tocList = document.getElementById("toc-list");

    if (tocList && vlogPosts.length > 0) {
        vlogPosts.forEach(function (post) {
            var titleEl = post.querySelector(".section-title");
            if (!titleEl) return;
            var title = titleEl.textContent;
            var tocItem = document.createElement("li");
            tocItem.textContent = title;
            tocItem.addEventListener("click", function () {
                post.scrollIntoView({ behavior: "smooth" });
            });
            tocList.appendChild(tocItem);
        });
    }

    if (searchInput && vlogPosts.length > 0) {
        searchInput.addEventListener("input", function () {
            var filter = searchInput.value.toLowerCase();
            vlogPosts.forEach(function (post) {
                var titleEl = post.querySelector(".section-title");
                if (!titleEl) return;
                var title = titleEl.textContent.toLowerCase();
                post.style.display = title.includes(filter) ? "" : "none";
            });
        });
    }

    // ===========================
    // Certificate Category Filter
    // ===========================
    var categoryButtons = document.querySelectorAll(".category-btn");
    var certificateItems = document.querySelectorAll(".certificate-item");

    if (categoryButtons.length > 0 && certificateItems.length > 0) {
        categoryButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                categoryButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                });
                button.classList.add("active");

                var category = button.getAttribute("data-category");

                certificateItems.forEach(function (item) {
                    if (
                        category === "all" ||
                        item.getAttribute("data-category") === category
                    ) {
                        item.classList.add("show");
                    } else {
                        item.classList.remove("show");
                    }
                });
            });
        });
    }
});
