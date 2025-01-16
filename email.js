const btn = document.getElementById('button');
const statusMessage = document.getElementById('status');

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    btn.value = 'Sending...';
    btn.disabled = true; // Disable the button
    statusMessage.textContent = 'Sending...';

    const serviceID = 'default_service';
    const templateID = 'template_5vya6ni';

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.value = 'Send Email';
            statusMessage.textContent = 'Message Sent!';
            setTimeout(() => {
                btn.disabled = false; // Re-enable the button after 2 minutes
                statusMessage.textContent = '';
            }, 120000); // 2 minutes in milliseconds
        }, (err) => {
            btn.value = 'Send Email';
            statusMessage.textContent = 'Failed to send message. Please try again.';
            setTimeout(() => {
                btn.disabled = false; // Re-enable the button after 2 minutes
                statusMessage.textContent = '';
            }, 120000); // 2 minutes in milliseconds
            alert(JSON.stringify(err));
        });
});