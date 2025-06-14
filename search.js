document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const vlogPosts = document.querySelectorAll('.vlog-post');
    const tocList = document.getElementById('toc-list');

    // Populate table of contents
    vlogPosts.forEach((post, index) => {
        const title = post.querySelector('.section-title').textContent;
        const tocItem = document.createElement('li');
        tocItem.textContent = title;
        tocItem.addEventListener('click', () => {
            post.scrollIntoView({ behavior: 'smooth' });
        });
        tocList.appendChild(tocItem);
    });

    // Filter vlog posts based on search input
    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        vlogPosts.forEach(post => {
            const title = post.querySelector('.section-title').textContent.toLowerCase();
            if (title.includes(filter)) {
                post.style.display = '';
            } else {
                post.style.display = 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const certificateItems = document.querySelectorAll('.certificate-item');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            certificateItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });
        });
    });
});