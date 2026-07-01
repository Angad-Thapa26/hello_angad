(function () {
    var URL = "content-data.json";
    if (window.KnowAngadRepoPromise) {
        return;
    }

    function setBadge(text, ok) {
        try {
            var id = "repo-content-status";
            var existing = document.getElementById(id);
            if (!existing) {
                existing = document.createElement("div");
                existing.id = id;
                existing.setAttribute("aria-hidden", "true");
                existing.style.position = "fixed";
                existing.style.right = "12px";
                existing.style.bottom = "12px";
                existing.style.padding = "6px 10px";
                existing.style.borderRadius = "999px";
                existing.style.fontSize = "12px";
                existing.style.zIndex = 99999;
                existing.style.boxShadow = "0 6px 18px rgba(0,0,0,0.4)";
                document.body.appendChild(existing);
            }

            existing.textContent = text;
            existing.style.background = ok ? "rgba(34,197,94,0.18)" : "rgba(220,38,38,0.13)";
            existing.style.color = ok ? "#22c55e" : "#ef4444";
            existing.style.border = ok ? "1px solid rgba(34,197,94,0.18)" : "1px solid rgba(239,68,68,0.12)";
        } catch (e) {
            // noop
        }
    }

    var p = fetch(URL, { cache: "no-store" })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("no content-data.json");
            }

            return response.json();
        })
        .then(function (data) {
            window.KnowAngadRepoData = data;
            document.dispatchEvent(new CustomEvent("know-angad:repo-loaded", { detail: data }));
            setBadge("Repo content loaded", true);
            return data;
        })
        .catch(function () {
            window.KnowAngadRepoData = null;
            document.dispatchEvent(new CustomEvent("know-angad:repo-load-failed"));
            setBadge("Repo content unavailable", false);
            return null;
        });

    window.KnowAngadRepoPromise = p;
})();
