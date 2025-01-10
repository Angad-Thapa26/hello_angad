document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const statusElement = document.getElementById('status');
            statusElement.textContent = "Initiating secure transmission...";

            const serviceID = 'service_z4u5rro';
            const templateID = 'template_aqx14ah';
            const templateParams = {
                to_name: 'Admin',
                from_name: this.querySelector('[name="user_name"]').value,
                from_email: this.querySelector('[name="user_email"]').value,
                message: this.querySelector('[name="message"]').value,
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    alert("Message transmitted successfully!");
                    statusElement.textContent = "Message transmitted successfully!";
                    contactForm.reset();
                    setTimeout(() => {
                        statusElement.textContent = "";
                    }, 5000);
                }, (err) => {
                    statusElement.textContent = "Transmission failed. Please try again.";
                    console.error("Error:", err);
                    setTimeout(() => {
                        statusElement.textContent = "";
                    }, 5000);
                });
        });
    }
});