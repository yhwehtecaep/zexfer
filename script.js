(function() {
    // Reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
    revealElements.forEach(el => observer.observe(el));
    window.addEventListener('load', () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) el.classList.add('visible');
        });
    });

    // Navbar background
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.background = 'rgba(255, 255, 255, 0.03)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(16px)';
            navbar.style.webkitBackdropFilter = 'blur(16px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.borderBottom = '1px solid transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.webkitBackdropFilter = 'none';
        }
    });

    // FAQ toggle
    const faqRows = document.querySelectorAll('.faq-row');
    faqRows.forEach(row => {
        const question = row.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others
            faqRows.forEach(r => {
                if (r !== row) r.classList.remove('active');
            });
            // Toggle current
            row.classList.toggle('active');
        });
    });

    // Live Crypto Prices - Direct Fetch
    async function fetchCryptoPrices() {
        const tickerContainer = document.getElementById('crypto-ticker');
        if (!tickerContainer) return;

        try {
            // Fetch directly from CoinGecko Public API (No API key needed)
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,dogecoin&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            tickerContainer.innerHTML = ''; // Clear loading text
            
            data.forEach(coin => {
                const changeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
                const changeSign = coin.price_change_percentage_24h >= 0 ? '+' : '';
                
                const card = document.createElement('div');
                card.className = 'crypto-card';
                card.innerHTML = `
                    <div class="crypto-card-header">
                        <img src="${coin.image}" alt="${coin.name}" width="24" height="24">
                        <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span>
                    </div>
                    <div class="crypto-price">$${coin.current_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</div>
                    <div class="crypto-change ${changeClass}">
                        ${changeSign}${coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                `;
                tickerContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            tickerContainer.innerHTML = '<div class="loading-prices" style="color: #ff4d4d;">Live API rate limit reached. Please wait...</div>';
        }
    }

    // Initial fetch
    fetchCryptoPrices();
    
    // Refresh every 60 seconds
    setInterval(fetchCryptoPrices, 60000);

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navButtons = document.getElementById('nav-buttons');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navButtons.classList.toggle('active');
        });
    }

})();
