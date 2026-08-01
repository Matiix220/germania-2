(() => {
  const page = document.body.dataset.page || '';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = `
    <header class="site-header" id="siteHeader">
      <div class="promo-bar" aria-label="Aktualne informacje sklepu">
        <div class="promo-track">
          <span>◆ Darmowa konsultacja doboru po VIN</span>
          <span>◆ Wysyłka magazynowa nawet w 24–48 h</span>
          <span>◆ Wyselekcjonowane marki niemieckiej motoryzacji</span>
          <span>◆ Części • Akcesoria • Gadżety • Serwis</span>
          <span aria-hidden="true">◆ Darmowa konsultacja doboru po VIN</span>
          <span aria-hidden="true">◆ Wysyłka magazynowa nawet w 24–48 h</span>
        </div>
      </div>
      <div class="container header-inner">
        <a class="brand-logo header-logo" href="index.html" aria-label="GERMANIA — strona główna">
          <img src="assets/images/logo-header.png" alt="GERMANIA">
        </a>
        <nav class="main-nav" id="mainNav" aria-label="Główna nawigacja">
          <a class="nav-link" data-nav="home" href="index.html"><span>Start</span></a>
          <a class="nav-link" data-nav="parts" href="czesci.html"><span>Części</span></a>
          <a class="nav-link" data-nav="accessories" href="akcesoria.html"><span>Akcesoria</span></a>
          <a class="nav-link" data-nav="gadgets" href="gadzety.html"><span>Gadżety</span></a>
          <a class="nav-link" data-nav="services" href="uslugi.html"><span>Usługi</span></a>
          <a class="nav-link" data-nav="news" href="aktualnosci.html"><span>Aktualności</span></a>
          <a class="nav-link" data-nav="contact" href="kontakt.html"><span>Kontakt</span></a>
        </nav>
        <div class="header-actions">
          <button class="icon-btn cart-trigger" type="button" aria-label="Otwórz koszyk">
            <span class="cart-icon">🛒</span><span class="cart-count">0</span>
          </button>
          <a class="btn btn-primary btn-small header-cta" href="kontakt.html"><span>Zapytaj eksperta</span><b>→</b></a>
          <button class="icon-btn menu-toggle" type="button" aria-label="Otwórz menu" aria-expanded="false"><span>☰</span></button>
        </div>
      </div>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="footer-road" aria-hidden="true"><span></span></div>
      <div class="container">
        <div class="footer-newsletter interactive-glow">
          <div>
            <span class="eyebrow">GERMANIA Club</span>
            <h3>Najciekawsze premiery, porady i okazje prosto do garażu.</h3>
          </div>
          <form class="newsletter-form" id="newsletterForm">
            <label class="sr-only" for="newsletterEmail">Adres e-mail</label>
            <input class="input" id="newsletterEmail" type="email" placeholder="Twój adres e-mail" required>
            <button class="btn btn-primary" type="submit">Dołącz →</button>
          </form>
        </div>
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand-logo footer-logo" href="index.html" aria-label="GERMANIA — strona główna">
              <img src="assets/images/logo-footer.png" alt="GERMANIA">
            </a>
            <p>Części, akcesoria, usługi i wiedza dla ludzi, którzy niemiecką motoryzację traktują jak coś więcej niż środek transportu.</p>
            <div class="footer-badges"><span>DE DNA</span><span>PL SERVICE</span><span>VIN SUPPORT</span></div>
            <div class="socials">
              <a href="#" aria-label="Instagram"><span>IG</span></a><a href="#" aria-label="Facebook"><span>FB</span></a><a href="#" aria-label="YouTube"><span>YT</span></a><a href="#" aria-label="TikTok"><span>TT</span></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Sklep</h4>
            <a href="czesci.html">Części samochodowe</a>
            <a href="akcesoria.html">Akcesoria do aut</a>
            <a href="gadzety.html">Gadżety</a>
            <a href="uslugi.html">Usługi</a>
          </div>
          <div class="footer-col">
            <h4>GERMANIA</h4>
            <a href="o-nas.html">O nas</a>
            <a href="aktualnosci.html">Aktualności</a>
            <a href="kontakt.html">Kontakt</a>
            <a href="kontakt.html#faq">FAQ</a>
          </div>
          <div class="footer-col">
            <h4>Informacje</h4>
            <a href="regulamin.html">Regulamin</a>
            <a href="polityka-prywatnosci.html">Polityka prywatności</a>
            <a href="regulamin.html#dostawa">Dostawa i płatności</a>
            <a href="regulamin.html#zwroty">Zwroty i reklamacje</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span id="footerYear"></span> GERMANIA. Projekt demonstracyjny.</span>
          <span class="footer-signature">ENGINEERED FOR ENTHUSIASTS</span>
          <span class="vault-trigger" id="vaultTrigger" title="">●</span>
        </div>
      </div>
    </footer>`;

  const cartDrawer = `
    <aside class="cart-drawer" id="cartDrawer" aria-hidden="true">
      <div class="cart-backdrop" data-cart-close></div>
      <div class="cart-panel" role="dialog" aria-modal="true" aria-label="Koszyk">
        <div class="cart-head">
          <div><span class="eyebrow">GERMANIA Store</span><h3>Twój koszyk</h3></div>
          <button class="icon-btn" data-cart-close aria-label="Zamknij">✕</button>
        </div>
        <div class="cart-progress"><span></span><small>Dobierzemy kompatybilność przed realizacją.</small></div>
        <div class="cart-items" id="cartItems"></div>
        <div class="cart-foot">
          <div class="cart-total"><span>Razem</span><strong id="cartTotal">0,00 zł</strong></div>
          <a class="btn btn-primary" style="width:100%" href="kontakt.html?temat=zamowienie">Przejdź do zamówienia →</a>
          <p class="cart-note">Finalne zamówienie zostanie potwierdzone po kontakcie z doradcą.</p>
        </div>
      </div>
    </aside>`;

  const headerMount = document.getElementById('site-header');
  const footerMount = document.getElementById('site-footer');
  if (headerMount) headerMount.innerHTML = header;
  if (footerMount) footerMount.innerHTML = footer;
  document.body.insertAdjacentHTML('afterbegin', '<div class="scroll-progress" id="scrollProgress"></div><div class="page-loader" aria-hidden="true"><div class="loader-logo"><img src="assets/images/logo-header.png" alt=""></div><span></span></div>');
  document.body.insertAdjacentHTML('beforeend', cartDrawer + '<div class="cursor-glow" id="cursorGlow"></div><button class="back-top" id="backTop" aria-label="Wróć na górę">↑</button><div class="toast-stack" id="toastStack"></div>');

  document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');
  const year = document.getElementById('footerYear');
  if (year) year.textContent = new Date().getFullYear();

  requestAnimationFrame(() => document.body.classList.add('ready'));

  const siteHeader = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  const onScroll = () => {
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    const ratio = Math.min(scrollY / max, 1);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    siteHeader?.classList.toggle('scrolled', scrollY > 20);
    backTop?.classList.toggle('visible', scrollY > 650);
  };
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  backTop?.addEventListener('click', () => scrollTo({top:0,behavior:prefersReducedMotion?'auto':'smooth'}));

  const nav = document.getElementById('mainNav');
  const menuToggle = document.querySelector('.menu-toggle');
  menuToggle?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    const open = Boolean(nav?.classList.contains('open'));
    menuToggle.setAttribute('aria-expanded', String(open));
    const span = menuToggle.querySelector('span');
    if (span) span.textContent = open ? '✕' : '☰';
    document.body.classList.toggle('menu-open', open);
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth <= 1100 && nav?.classList.contains('open') && !event.target.closest('.main-nav') && !event.target.closest('.menu-toggle')) {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      const span = menuToggle?.querySelector('span');
      if (span) span.textContent = '☰';
      document.body.classList.remove('menu-open');
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: .1, rootMargin:'0px 0px -35px'});
  document.querySelectorAll('.reveal,.stagger').forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const duration = 1100;
      const tick = now => {
        const t = Math.min((now-start)/duration,1);
        const eased = 1-Math.pow(1-t,3);
        el.textContent = Math.round(target*eased).toLocaleString('pl-PL') + suffix;
        if (t<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el=>counterObserver.observe(el));

  const formatPrice = value => new Intl.NumberFormat('pl-PL', {style:'currency',currency:'PLN'}).format(Number(value || 0));
  window.GERMANIA_UTILS = window.GERMANIA_UTILS || {};
  window.GERMANIA_UTILS.formatPrice = formatPrice;
  window.GERMANIA_UTILS.getProducts = () => {
    const defaults = [...(window.GERMANIA_DATA?.products || []), ...(window.GERMANIA_DATA?.services || [])];
    const custom = JSON.parse(localStorage.getItem('germania_custom_products') || '[]');
    return [...custom, ...defaults];
  };
  window.GERMANIA_UTILS.getNews = () => {
    const custom = JSON.parse(localStorage.getItem('germania_custom_posts') || '[]');
    return [...custom, ...(window.GERMANIA_DATA?.news || [])];
  };
  window.GERMANIA_UTILS.toast = (message, type='success') => {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type==='error'?'!':'✓'}</span><div>${message}</div>`;
    stack.appendChild(toast);
    setTimeout(() => toast.classList.add('leaving'), 2800);
    setTimeout(() => toast.remove(), 3300);
  };

  const enhanceInteractive = (root=document) => {
    root.querySelectorAll('.product-card,.category-card,.news-card,.panel,.contact-card,.stat-card,.message-card,.interactive-glow').forEach(el => {
      if (el.dataset.enhanced) return;
      el.dataset.enhanced = 'true';
      el.classList.add('glow-card');
      if (prefersReducedMotion || matchMedia('(pointer: coarse)').matches) return;
      el.addEventListener('pointermove', event => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        if (el.matches('.product-card,.category-card,.news-card,.stat-card')) {
          const rx = ((y/rect.height)-.5)*-5;
          const ry = ((x/rect.width)-.5)*7;
          el.style.setProperty('--rx', `${rx}deg`);
          el.style.setProperty('--ry', `${ry}deg`);
        }
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx','0deg');
        el.style.setProperty('--ry','0deg');
      });
    });
  };
  window.GERMANIA_UTILS.enhance = enhanceInteractive;
  enhanceInteractive();
  const mutationObserver = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) enhanceInteractive(node.matches?.('.product-card,.category-card,.news-card,.panel,.contact-card,.stat-card,.message-card,.interactive-glow') ? node.parentElement : node);
  })));
  mutationObserver.observe(document.body,{childList:true,subtree:true});

  if (!prefersReducedMotion && !matchMedia('(pointer: coarse)').matches) {
    const glow = document.getElementById('cursorGlow');
    addEventListener('pointermove', event => {
      if (!glow) return;
      glow.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      glow.classList.add('active');
    },{passive:true});
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('pointermove',event=>{
        const rect=btn.getBoundingClientRect();
        btn.style.setProperty('--bx',`${event.clientX-rect.left}px`);
        btn.style.setProperty('--by',`${event.clientY-rect.top}px`);
      });
    });
  }

  document.querySelectorAll('.page-hero').forEach(hero => {
    hero.insertAdjacentHTML('beforeend','<div class="page-hero-telemetry" aria-hidden="true"><i></i><i></i><i></i><b>GERMAN ENGINEERING / 01</b></div>');
  });

  let cart = JSON.parse(localStorage.getItem('germania_cart') || '[]');
  const saveCart = () => {
    localStorage.setItem('germania_cart', JSON.stringify(cart));
    renderCart();
  };
  const renderCart = () => {
    const cartQuantity = cart.reduce((sum,item)=>sum+item.qty,0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = cartQuantity);
    const mount = document.getElementById('cartItems');
    const total = document.getElementById('cartTotal');
    if (!mount || !total) return;
    if (!cart.length) {
      mount.innerHTML = '<div class="cart-empty"><div><div class="cart-empty-icon">🛒</div><h3>Koszyk czeka na moc</h3><p>Dodaj produkt lub usługę z katalogu.</p><a class="arrow-link" href="czesci.html">Przeglądaj ofertę →</a></div></div>';
      total.textContent = formatPrice(0);
      return;
    }
    mount.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.icon || '📦'}</div>
        <div><h4>${item.name}</h4><small>${item.qty} × ${formatPrice(item.price)}</small></div>
        <button class="cart-remove" data-cart-remove="${item.id}" aria-label="Usuń">✕</button>
      </div>`).join('');
    total.textContent = formatPrice(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
  };
  const openCart = () => {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartDrawer')?.setAttribute('aria-hidden','false');
    document.body.classList.add('drawer-open');
  };
  const closeCart = () => {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartDrawer')?.setAttribute('aria-hidden','true');
    document.body.classList.remove('drawer-open');
  };
  document.addEventListener('click', event => {
    if (event.target.closest('.cart-trigger')) openCart();
    if (event.target.closest('[data-cart-close]')) closeCart();
    const add = event.target.closest('[data-add-cart]');
    if (add) {
      const id = add.dataset.addCart;
      const item = window.GERMANIA_UTILS.getProducts().find(product => String(product.id) === String(id));
      if (!item) return;
      const current = cart.find(entry => entry.id === item.id);
      current ? current.qty++ : cart.push({id:item.id,name:item.name,price:Number(item.price),icon:item.icon,qty:1});
      saveCart();
      add.classList.add('added');
      const oldText = add.textContent;
      add.textContent = 'Dodano ✓';
      setTimeout(()=>{add.classList.remove('added');add.textContent=oldText;},1000);
      window.GERMANIA_UTILS.toast(`${item.name} dodano do koszyka.`);
    }
    const remove = event.target.closest('[data-cart-remove]');
    if (remove) {
      cart = cart.filter(item => String(item.id) !== remove.dataset.cartRemove);
      saveCart();
    }
  });
  document.addEventListener('keydown',event=>{ if(event.key==='Escape') closeCart(); });
  renderCart();

  document.getElementById('newsletterForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('newsletterEmail');
    if (!input?.value) return;
    localStorage.setItem('germania_newsletter_email', input.value.trim());
    event.currentTarget.reset();
    window.GERMANIA_UTILS.toast('Witaj w GERMANIA Club. Adres został zapisany demonstracyjnie.');
  });

  let vaultClicks = 0;
  let vaultTimer;
  document.getElementById('vaultTrigger')?.addEventListener('click', () => {
    clearTimeout(vaultTimer);
    vaultClicks++;
    if (vaultClicks >= 7) window.location.href = 'panel-g7x9k/login.html';
    vaultTimer = setTimeout(() => vaultClicks = 0, 2500);
  });

  const params = new URLSearchParams(location.search);
  if (params.get('temat')) {
    const subject = document.querySelector('[name="subject"]');
    if (subject) subject.value = params.get('temat') === 'zamowienie' ? 'Zamówienie / koszyk' : params.get('temat');
  }
})();
