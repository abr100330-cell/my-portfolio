// script.js – Portfolio interactions

document.addEventListener('DOMContentLoaded', () => {

    // ===== Mobile Menu Toggle =====
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('show');
            // Toggle icon between ☰ and ✕
            navToggle.textContent = navList.classList.contains('show') ? '✕' : '☰';
        });

        // Close menu when a link is clicked
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('show');
                navToggle.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navList.classList.contains('show') && !navList.contains(e.target) && !navToggle.contains(e.target)) {
                navList.classList.remove('show');
                navToggle.textContent = '☰';
            }
        });
    }

    // ===== Contact Form – WhatsApp-এ পাঠান =====
    const form = document.getElementById('contactForm');
    const thankYouMsg = document.getElementById('thankYouMsg');
    const emailFallback = document.getElementById('emailFallback');

    const WA_NUMBER = '8801918100330';
    const EMAIL_ADDRESS = 'abr100330@gmail.com';

    // ফর্ম থেকে ডাটা নিয়ে মেসেজ তৈরি
    function buildMessage() {
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const message = form.elements['message'].value.trim();
        return { name, email, message };
    }

    // ভ্যালিডেশন
    function validateForm() {
        const { name, email, message } = buildMessage();
        if (!name || !email || !message) {
            alert('অনুগ্রহ করে সব ঘর পূরণ করুন।');
            return false;
        }
        return true;
    }

    // মেসেজ টেক্সট ফরম্যাট
    function formatMessage() {
        const { name, email, message } = buildMessage();
        return `পোর্টফোলিও থেকে নতুন মেসেজ\n\nনাম: ${name}\nইমেইল: ${email}\nমেসেজ: ${message}`;
    }

    // ধন্যবাদ বার্তা দেখানো
    function showThankYou(name) {
        if (thankYouMsg) {
            thankYouMsg.style.display = 'block';
            thankYouMsg.innerHTML = `✅ ধন্যবাদ, <strong>${name}</strong>! আপনার মেসেজ পাঠানো হয়েছে।`;
        }
        form.reset();
        setTimeout(() => {
            if (thankYouMsg) thankYouMsg.style.display = 'none';
        }, 5000);
    }

    // "পাঠান" বাটন → WhatsApp
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!validateForm()) return;

            const { name } = buildMessage();
            const text = encodeURIComponent(formatMessage());
            window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
            showThankYou(name);
        });
    }

    // "অথবা ইমেইলে পাঠান" লিংক
    if (emailFallback) {
        emailFallback.addEventListener('click', e => {
            e.preventDefault();
            if (!validateForm()) return;

            const { name } = buildMessage();
            const subject = encodeURIComponent('পোর্টফোলিও থেকে নতুন মেসেজ');
            const body = encodeURIComponent(formatMessage());
            window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
            showThankYou(name);
        });
    }

    // ===== Dark Mode Toggle =====
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        // Check saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            darkToggle.textContent = '☀️';
        }

        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            darkToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('darkMode', isDark);
        });
    }

    // ===== Scroll Reveal Animation (IntersectionObserver দিয়ে স্মুথ রিলিজ) =====
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.08
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        const onScroll = () => {
            const viewportHeight = window.innerHeight;
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < viewportHeight - 60) {
                    el.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ===== Work Cards Popup (Modal) =====
    const cardModal = document.getElementById('cardModal');
    const cardModalClose = document.getElementById('cardModalClose');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const workCards = document.querySelectorAll('#work .card');

    function openCardModal(card) {
        const img = card.querySelector('img');
        const title = card.querySelector('h3');
        const desc = card.querySelector('p');

        if (img && modalImg) {
            modalImg.src = img.src;
            modalImg.alt = img.alt || 'কাজের ছবি';
        }
        if (title && modalTitle) {
            modalTitle.textContent = title.textContent;
        }
        if (desc && modalDesc) {
            modalDesc.textContent = desc.textContent;
        }

        if (cardModal) {
            cardModal.classList.add('active');
            cardModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
        }
    }

    function closeCardModal() {
        if (cardModal) {
            cardModal.classList.remove('active');
            cardModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        }
    }

    // কার্ডে চাপলে পপআপ ওপেন
    workCards.forEach(card => {
        card.addEventListener('click', () => openCardModal(card));
    });

    // কোণের X বাটনে চাপলে বন্ধ
    if (cardModalClose) {
        cardModalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCardModal();
        });
    }

    // কার্ডের বাইরে চাপলে বন্ধ
    if (cardModal) {
        cardModal.addEventListener('click', (e) => {
            if (e.target === cardModal) {
                closeCardModal();
            }
        });
    }

    // কিবোর্ডের Escape বাটন চাপলেও বন্ধ
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cardModal && cardModal.classList.contains('active')) {
            closeCardModal();
        }
    });
});
