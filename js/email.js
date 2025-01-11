document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });

        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const statusElement = document.getElementById('status');
            const submitButton = this.querySelector('.submit-btn');
            
            // Disable the submit button
            submitButton.disabled = true;
            
            // Show initial status
            statusElement.textContent = "Initiating secure transmission...";
            
            const serviceID = 'service_z4u5rro';
            const templateID = 'template_aqx14ah';
            const templateParams = {
                to_name: 'Admin',
                from_name: this.querySelector('[name="user_name"]').value,
                from_email: this.querySelector('[name="user_email"]').value,
                message: this.querySelector('[name="message"]').value,
            };

            try {
                console.log('Attempting to send email...');
                statusElement.textContent = "Message queued for transmission...";
                
                const response = await emailjs.send(serviceID, templateID, templateParams);
                console.log('SUCCESS!', response.status, response.text);
                
                statusElement.textContent = "Message transmitted successfully!";
                contactForm.reset();
                
            } catch (err) {
                console.error('FAILED...', err);
                statusElement.textContent = "Transmission failed. Please try again.";
            } finally {
                // Re-enable the button after 5 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    statusElement.textContent = "";
                }, 5000);
            }

            return false;
        });
    }
});