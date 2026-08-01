(() => {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  const search = document.getElementById('newsSearch');
  const category = document.getElementById('newsCategory');
  const sort = document.getElementById('newsSort');
  const modal = document.getElementById('articleModal');
  const modalInner = document.getElementById('articleModalInner');
  const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  const getItems = () => window.GERMANIA_UTILS.getNews();
  const categories = [...new Set(getItems().map(item => item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pl'));
  category.innerHTML = '<option value="">Wszystkie kategorie</option>' + categories.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');

  const formatDate = value => new Intl.DateTimeFormat('pl-PL',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(value));
  const card = item => `
    <article class="news-card">
      <div class="news-cover" style="--cover:${item.cover || 'linear-gradient(135deg,#232526,#414345)'}">
        <span class="news-icon">${escapeHtml(item.icon || '📰')}</span>
        <span class="news-category">${escapeHtml(item.category || 'Aktualności')}</span>
      </div>
      <div class="news-content">
        <div class="news-date">${formatDate(item.date)} • 5 min czytania</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.lead)}</p>
        <button class="btn btn-secondary btn-small" data-open-article="${escapeHtml(item.id)}">Czytaj artykuł →</button>
      </div>
    </article>`;

  function render() {
    let items = getItems();
    const q = (search.value || '').toLowerCase().trim();
    if (q) items = items.filter(item => [item.title,item.lead,item.content,item.category].join(' ').toLowerCase().includes(q));
    if (category.value) items = items.filter(item => item.category === category.value);
    items.sort((a,b)=> sort.value === 'oldest' ? new Date(a.date)-new Date(b.date) : new Date(b.date)-new Date(a.date));
    grid.innerHTML = items.length ? items.map(card).join('') : '<div class="empty-state"><div><div style="font-size:3rem">📰</div><h3>Brak artykułów</h3><p>Spróbuj innej kategorii lub frazy.</p></div></div>';
    window.GERMANIA_UTILS.enhance?.(grid);
  }

  function openArticle(id) {
    const item = getItems().find(article => String(article.id) === String(id));
    if (!item) return;
    const paragraphs = String(item.content || item.lead || '').split(/\n\n+/).map(p=>`<p>${escapeHtml(p)}</p>`).join('');
    modalInner.innerHTML = `
      <div class="article-top" style="--cover:${item.cover || 'linear-gradient(135deg,#232526,#414345)'}">
        <span class="news-category">${escapeHtml(item.category)}</span>
        <div class="news-date" style="margin-top:12px;color:#ddd">${formatDate(item.date)} • GERMANIA MAGAZINE</div>
        <h2>${escapeHtml(item.title)}</h2>
        <p class="lead">${escapeHtml(item.lead)}</p>
      </div>
      <div class="article-body">${paragraphs}<hr style="margin:35px 0"><p class="muted">Materiał przykładowy przygotowany na potrzeby demonstracyjnej strony GERMANIA.</p><a class="btn btn-primary" href="kontakt.html">Masz pytanie? Napisz do nas →</a></div>`;
    modal.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeArticle(){ modal.classList.remove('open'); document.body.style.overflow=''; }

  [search,category,sort].forEach(el=>el.addEventListener(el===search?'input':'change',render));
  document.addEventListener('click',e=>{
    const opener=e.target.closest('[data-open-article]');
    if(opener) openArticle(opener.dataset.openArticle);
    if(e.target.closest('[data-close-article]') || e.target===modal) closeArticle();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeArticle();});
  render();
})();
