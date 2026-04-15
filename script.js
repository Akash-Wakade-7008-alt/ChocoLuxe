// --- Data ---
  const products = [
    { id: 1, name: "Ecuador Dark 72%", origin: "Ecuador", desc: "Intense cacao with notes of dried cherry and toasted walnut.", price: 499, oldPrice: 649, emoji: "🍫", bg: "linear-gradient(135deg,#3d1600,#1a0900)", badge: "Bestseller", category: "dark" },
    { id: 2, name: "Kerala Cardamom Bliss", origin: "Kerala, India", desc: "Milk chocolate infused with hand-ground green cardamom.", price: 399, oldPrice: null, emoji: "🟤", bg: "linear-gradient(135deg,#5c2d0a,#2d1200)", badge: null, category: "milk" },
    { id: 3, name: "Hazelnut Praline Bar", origin: "Piedmont, Italy", desc: "Silky milk chocolate layered with house-made hazelnut praline.", price: 549, oldPrice: null, emoji: "🌰", bg: "linear-gradient(135deg,#7a3d10,#3d1600)", badge: "New", category: "milk" },
    { id: 4, name: "White Rose & Raspberry", origin: "Madagascar", desc: "White chocolate with real rose petals and freeze-dried raspberries.", price: 449, oldPrice: null, emoji: "🌹", bg: "linear-gradient(135deg,#4a1a00,#2d1200)", badge: null, category: "white" },
    { id: 5, name: "Oaxacan 85% Dark", origin: "Oaxaca, Mexico", desc: "An intense, austere dark with earthy spice and smoky depth.", price: 599, oldPrice: 749, emoji: "🖤", bg: "linear-gradient(135deg,#1a0a00,#0d0500)", badge: "Limited", category: "dark" },
    { id: 6, name: "Truffle Gift Box", origin: "ChocoLuxe Atelier", desc: "12 handmade truffles: salted caramel, espresso, and passionfruit.", price: 1299, oldPrice: 1599, emoji: "🎁", bg: "linear-gradient(135deg,#8b4513,#3d1600)", badge: "Gift", category: "gift" },
    { id: 7, name: "Saffron White Bar", origin: "Kashmir", desc: "Premium white chocolate with Kashmiri saffron and pistachios.", price: 679, oldPrice: null, emoji: "🌸", bg: "linear-gradient(135deg,#5c2d0a,#3d1600)", badge: null, category: "white" },
    { id: 8, name: "The Grand Selection", origin: "Multiple Origins", desc: "Our iconic gift hamper: 6 bars from 6 countries, beautifully boxed.", price: 2499, oldPrice: 2999, emoji: "✨", bg: "linear-gradient(135deg,#c8902e,#5c2d0a)", badge: "Gift", category: "gift" },
  ];

  const reviews = [
    { stars: 5, text: "The Ecuador Dark 72% is unlike anything I've tasted. Complex, rich, utterly addictive. I've ordered four times already.", name: "Priya S.", loc: "Mumbai" },
    { stars: 5, text: "Gifted the Grand Selection to my mother — she called me immediately to ask where I bought it. Beautiful packaging, incredible chocolate.", name: "Rahul M.", loc: "Bangalore" },
    { stars: 5, text: "As a pastry chef, I'm obsessed with quality. ChocoLuxe is the only chocolate I trust for my restaurant's desserts.", name: "Chef Ananya K.", loc: "Delhi" },
  ];

  // --- State ---
  let cart = [];
  let activeFilter = 'all';

  // --- Render Products ---
  function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const filtered = activeFilter === 'all' ? products : products.filter(p => p.category === activeFilter);
    grid.innerHTML = filtered.map(p => `
      <div class="product-card" data-id="${p.id}" style="animation: fadeUp 0.5s both;">
        <div class="product-img">
          <div class="product-bg" style="background:${p.bg}; position:absolute;inset:0;opacity:0.7;"></div>
          ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
          <span class="product-emoji">${p.emoji}</span>
        </div>
        <div class="product-info">
          <div class="product-origin">${p.origin}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-footer">
            <div class="product-price">
              ${p.oldPrice ? `<span class="old">₹${p.oldPrice}</span>` : ''}₹${p.price}
            </div>
            <button class="add-btn" id="btn-${p.id}" onclick="addToCart(${p.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function filterProducts(cat, el) {
    activeFilter = cat;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderProducts();
  }

  // --- Render Reviews ---
  function renderReviews() {
    document.getElementById('reviewsGrid').innerHTML = reviews.map(r => `
      <div class="review-card reveal">
        <div class="review-stars">${'★'.repeat(r.stars)}</div>
        <div class="review-text">"${r.text}"</div>
        <div class="review-author">
          <div class="review-avatar">${r.name[0]}</div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-loc">${r.loc}</div>
          </div>
        </div>
      </div>
    `).join('');
    observeReveal();
  }

  // --- Cart ---
  function addToCart(id) {
    const p = products.find(x => x.id === id);
    const existing = cart.find(x => x.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...p, qty: 1 });
    updateCart();
    showToast(`${p.emoji} ${p.name} added to cart`);
    const btn = document.getElementById(`btn-${id}`);
    if (btn) { btn.classList.add('added'); btn.textContent = '✓ Added'; setTimeout(() => { btn.classList.remove('added'); btn.textContent = 'Add to Cart'; }, 1500); }
  }

  function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    updateCart();
    renderCartItems();
  }

  function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if (item) { item.qty += delta; if (item.qty <= 0) removeFromCart(id); else { updateCart(); renderCartItems(); } }
  }

  function updateCart() {
    const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const count = cart.reduce((s, x) => s + x.qty, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('cartTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
    document.getElementById('cartFooter').style.display = cart.length ? 'block' : 'none';
    renderCartItems();
  }

  function renderCartItems() {
    const el = document.getElementById('cartItems');
    if (!cart.length) {
      el.innerHTML = `<div class="cart-empty"><span class="empty-icon">🍫</span>Your cart is empty.<br>Discover our collection.</div>`;
      return;
    }
    el.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');
  }

  function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
  }

  function checkout() {
    showToast('🎉 Thank you! Redirecting to checkout...');
    setTimeout(() => { toggleCart(); }, 1200);
  }

  // --- Toast ---
  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  // --- Newsletter ---
  function subscribeNewsletter() {
    const email = document.getElementById('emailInput').value.trim();
    if (!email || !email.includes('@')) { showToast('⚠️ Please enter a valid email'); return; }
    showToast('🎉 Welcome to the inner circle!');
    document.getElementById('emailInput').value = '';
  }

  // --- Custom Cursor ---
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('button, a, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; ring.style.width = '52px'; ring.style.height = '52px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; ring.style.width = '36px'; ring.style.height = '36px'; });
  });

  // --- Scroll Reveal ---
  function observeReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  // --- Init ---
  renderProducts();
  renderReviews();
  observeReveal();
