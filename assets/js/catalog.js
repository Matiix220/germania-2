(() => {
  const mount = document.getElementById('catalogGrid');
  if (!mount) return;
  const group = document.body.dataset.catalog;
  const allItems = () => window.GERMANIA_UTILS.getProducts().filter(item => item.group === group);
  const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const search = document.getElementById('filterSearch');
  const category = document.getElementById('filterCategory');
  const brand = document.getElementById('filterBrand');
  const maxPrice = document.getElementById('filterPrice');
  const priceOutput = document.getElementById('priceOutput');
  const availability = document.getElementById('filterAvailability');
  const condition = document.getElementById('filterCondition');
  const sort = document.getElementById('sortCatalog');
  const count = document.getElementById('resultCount');
  const filters = document.getElementById('filters');

  const unique = key => [...new Set(allItems().map(item => item[key]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'pl'));
  const populate = (select, values, label) => {
    if (!select) return;
    select.innerHTML = `<option value="">${label}</option>` + values.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
  };
  populate(category, unique('category'), 'Wszystkie kategorie');
  populate(brand, unique('brand'), 'Wszystkie marki');
  populate(condition, unique('condition'), 'Każdy typ');

  const maxFound = Math.max(...allItems().map(i => Number(i.price)), 1000);
  if (maxPrice) {
    maxPrice.max = Math.ceil(maxFound / 100) * 100;
    maxPrice.value = maxPrice.max;
    priceOutput.textContent = `do ${window.GERMANIA_UTILS.formatPrice(maxPrice.value)}`;
  }

  const card = item => {
    const available = Number(item.stock) > 0;
    const badgeClass = String(item.badge || '').toLowerCase().includes('promoc') ? 'sale' : '';
    const action = group === 'services' ? 'Rezerwuj' : 'Do koszyka';
    const stockCopy = !available ? 'Chwilowo niedostępny' : group === 'services' ? `${item.stock} dostępne terminy` : `Na stanie: ${item.stock} szt.`;
    return `
      <article class="product-card">
        <div class="product-visual">
          ${item.badge ? `<span class="product-badge ${badgeClass}">${escapeHtml(item.badge)}</span>` : '<span class="product-badge">GERMANIA Select</span>'}
          <button class="product-favorite" type="button" aria-label="Dodaj do ulubionych">♡</button>
          <span class="emoji">${escapeHtml(item.icon || '📦')}</span>
        </div>
        <div class="product-body">
          <div class="product-meta"><span>${escapeHtml(item.brand || 'GERMANIA')}</span><span>•</span><span>${escapeHtml(item.category || 'Oferta')}</span></div>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="product-description">${escapeHtml(item.description || '')}</p>
          <div class="product-benefits"><span>✓ Weryfikacja jakości</span><span>${group === 'services' ? 'Jasny zakres' : 'Dobór po VIN'}</span></div>
          <div class="stock ${available ? '' : 'out'}">${stockCopy}</div>
          <div class="price-row">
            <div class="price">${item.oldPrice ? `<del>${window.GERMANIA_UTILS.formatPrice(item.oldPrice)}</del>` : ''}<strong>${window.GERMANIA_UTILS.formatPrice(item.price)}</strong></div>
            <button class="btn btn-primary btn-small" data-add-cart="${escapeHtml(item.id)}" ${available ? '' : 'disabled style="opacity:.45;cursor:not-allowed"'}>${action}</button>
          </div>
        </div>
      </article>`;
  };

  function render() {
    let items = allItems();
    const q = (search?.value || '').trim().toLowerCase();
    if (q) items = items.filter(item => [item.name,item.description,item.brand,item.category].join(' ').toLowerCase().includes(q));
    if (category?.value) items = items.filter(item => item.category === category.value);
    if (brand?.value) items = items.filter(item => item.brand === brand.value);
    if (condition?.value) items = items.filter(item => item.condition === condition.value);
    if (availability?.checked) items = items.filter(item => Number(item.stock) > 0);
    if (maxPrice?.value) items = items.filter(item => Number(item.price) <= Number(maxPrice.value));

    switch (sort?.value) {
      case 'price-asc': items.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': items.sort((a,b)=>b.price-a.price); break;
      case 'name': items.sort((a,b)=>a.name.localeCompare(b.name,'pl')); break;
      case 'stock': items.sort((a,b)=>b.stock-a.stock); break;
      default: items.sort((a,b)=>String(a.id).localeCompare(String(b.id)));
    }

    count.textContent = `${items.length} ${items.length === 1 ? 'oferta' : (items.length > 1 && items.length < 5 ? 'oferty' : 'ofert')}`;
    mount.innerHTML = items.length ? items.map(card).join('') : '<div class="empty-state"><div><div style="font-size:3rem">🔍</div><h3>Brak pasujących ofert</h3><p>Zmień filtry lub wyczyść wyszukiwanie.</p><button class="btn btn-secondary btn-small" id="emptyClear">Wyczyść filtry</button></div></div>';
    window.GERMANIA_UTILS.enhance?.(mount);
  }

  const clear = () => {
    if (search) search.value = '';
    [category,brand,condition].forEach(el => { if(el) el.value=''; });
    if (availability) availability.checked = false;
    if (maxPrice) { maxPrice.value=maxPrice.max; priceOutput.textContent=`do ${window.GERMANIA_UTILS.formatPrice(maxPrice.value)}`; }
    if (sort) sort.value='featured';
    render();
  };

  [search,category,brand,maxPrice,availability,condition,sort].forEach(el => el?.addEventListener(el === search ? 'input' : 'change', () => {
    if (el === maxPrice) priceOutput.textContent = `do ${window.GERMANIA_UTILS.formatPrice(maxPrice.value)}`;
    render();
  }));
  maxPrice?.addEventListener('input', () => { priceOutput.textContent = `do ${window.GERMANIA_UTILS.formatPrice(maxPrice.value)}`; render(); });
  document.getElementById('clearFilters')?.addEventListener('click', clear);
  document.addEventListener('click', event => {
    if (event.target.closest('#emptyClear')) clear();
    const favorite = event.target.closest('.product-favorite');
    if (favorite) {
      favorite.classList.toggle('active');
      favorite.textContent = favorite.classList.contains('active') ? '♥' : '♡';
      window.GERMANIA_UTILS.toast(favorite.classList.contains('active') ? 'Dodano do ulubionych.' : 'Usunięto z ulubionych.');
    }
  });
  document.querySelectorAll('[data-filter-toggle]').forEach(btn => btn.addEventListener('click',()=>filters?.classList.toggle('open')));
  render();
})();
