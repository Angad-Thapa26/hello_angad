document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    var btn = document.getElementById("button");
    var statusMessage = document.getElementById("status");

    if (!form || !btn || !statusMessage) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        btn.textContent = "Sending...";
        btn.disabled = true;
        statusMessage.textContent = "Sending...";

        var serviceID = "default_service";
        var templateID = "template_5vya6ni";

        emailjs
            .sendForm(serviceID, templateID, form)
            .then(function () {
                btn.textContent = "Send Message";
                statusMessage.textContent = "Message sent successfully!";
                statusMessage.style.color = "#00ff00";
                form.reset();
                setTimeout(function () {
                    btn.disabled = false;
                    statusMessage.textContent = "";
                }, 5000);
            })
            .catch(function () {
                btn.textContent = "Send Message";
                statusMessage.textContent =
                    "Failed to send message. Please try again.";
                statusMessage.style.color = "#ff5f56";
                setTimeout(function () {
                    btn.disabled = false;
                    statusMessage.textContent = "";
                }, 5000);
            });
    });
});
