(() => {
  const sessionRaw = sessionStorage.getItem('germania_admin_session');
  let session;
  try { session = JSON.parse(sessionRaw); } catch { session = null; }
  if (!session || !session.token || Number(session.expires) < Date.now()) {
    sessionStorage.removeItem('germania_admin_session');
    location.replace('login.html');
    return;
  }

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const getCustomProducts = () => JSON.parse(localStorage.getItem('germania_custom_products') || '[]');
  const getCustomPosts = () => JSON.parse(localStorage.getItem('germania_custom_posts') || '[]');
  const getMessages = () => JSON.parse(localStorage.getItem('germania_messages') || '[]');
  const saveProducts = value => localStorage.setItem('germania_custom_products', JSON.stringify(value));
  const savePosts = value => localStorage.setItem('germania_custom_posts', JSON.stringify(value));
  const saveMessages = value => localStorage.setItem('germania_messages', JSON.stringify(value));
  const formatPrice = value => new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN'}).format(Number(value||0));
  const formatDate = value => new Intl.DateTimeFormat('pl-PL',{dateStyle:'medium',timeStyle: value?.includes('T') ? 'short' : undefined}).format(new Date(value));
  const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const groupNames = {parts:'Części',accessories:'Akcesoria',gadgets:'Gadżety',services:'Usługi'};
  let messageQuery = '';

  const toast = (message,type='success') => {
    const t=document.createElement('div');
    t.className=`toast ${type}`;
    t.innerHTML=`<span>${type==='error'?'!':'✓'}</span><div>${escapeHtml(message)}</div>`;
    $('#toastStack').append(t);
    setTimeout(()=>t.classList.add('leaving'),2700);
    setTimeout(()=>t.remove(),3200);
  };

  const animateStat = (element, target) => {
    if (!element) return;
    const from = Number(element.textContent || 0);
    if (from === Number(target)) return;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now-start)/550,1);
      element.textContent = Math.round(from+(Number(target)-from)*(1-Math.pow(1-t,3)));
      if(t<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  function switchView(name) {
    const target = $(`#view-${name}`);
    if (!target) return;
    $$('.admin-view').forEach(view => view.classList.toggle('active', view === target));
    $$('.admin-nav [data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === name));
    $('#adminSidebar').classList.remove('open');
    history.replaceState(null,'',`#${name}`);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  document.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) switchView(viewButton.dataset.view);
    const jump = event.target.closest('[data-view-jump]');
    if (jump) switchView(jump.dataset.viewJump);
    if (innerWidth <= 1050 && $('#adminSidebar').classList.contains('open') && !event.target.closest('#adminSidebar') && !event.target.closest('#adminMenuToggle')) $('#adminSidebar').classList.remove('open');
  });
  $('#adminMenuToggle').addEventListener('click',()=>$('#adminSidebar').classList.toggle('open'));
  $('#logoutButton').addEventListener('click',()=>{ sessionStorage.removeItem('germania_admin_session'); location.replace('login.html'); });

  const updateClock = () => {
    const now = new Date();
    $('#adminClock').textContent = now.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'});
    $('#adminDate').textContent = now.toLocaleDateString('pl-PL',{weekday:'long',day:'2-digit',month:'long'});
  };
  updateClock(); setInterval(updateClock,30000);

  function updateStats() {
    const allProductCount = (GERMANIA_DATA.products?.length || 0) + (GERMANIA_DATA.services?.length || 0) + getCustomProducts().length;
    const allPostCount = (GERMANIA_DATA.news?.length || 0) + getCustomPosts().length;
    const messages = getMessages();
    const unread = messages.filter(m=>m.status==='unread').length;
    const cartCount = JSON.parse(localStorage.getItem('germania_cart') || '[]').reduce((sum,item)=>sum+Number(item.qty||0),0);
    animateStat($('#statProducts'),allProductCount);
    animateStat($('#statPosts'),allPostCount);
    animateStat($('#statUnread'),unread);
    animateStat($('#statCart'),cartCount);
    $('#unreadBadge').textContent=unread ? `(${unread})` : '';
    const latest=messages.slice(0,3);
    $('#dashboardMessages').innerHTML=latest.length?latest.map(m=>`<div class="admin-row"><div class="admin-row-icon">✉</div><div><h3>${escapeHtml(m.subject)}</h3><p>${escapeHtml(m.name)} • ${formatDate(m.date)}</p></div><span class="status-dot ${m.status}">${m.status==='unread'?'nowa':m.status==='replied'?'odpisano':'przeczytana'}</span></div>`).join(''):'<div class="empty-admin"><div><div style="font-size:2.4rem">✉</div><p>Brak wiadomości z formularza.</p></div></div>';
  }

  function renderProducts() {
    const items=getCustomProducts();
    $('#customProductCount').textContent=`${items.length} ${items.length===1?'pozycja':'pozycji'}`;
    $('#adminProductList').innerHTML=items.length?items.map(item=>`<div class="admin-row"><div class="admin-row-icon">${escapeHtml(item.icon||'📦')}</div><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(groupNames[item.group]||item.group)} • ${escapeHtml(item.category)} • ${formatPrice(item.price)} • stan ${item.stock}</p></div><div class="admin-row-actions"><button class="btn btn-danger btn-small" data-delete-product="${escapeHtml(item.id)}">Usuń</button></div></div>`).join(''):'<div class="empty-admin"><div><div style="font-size:2.7rem">◆</div><h3>Tu pojawią się Twoje oferty</h3><p>Uzupełnij formularz po lewej i dodaj pierwszą pozycję.</p></div></div>';
  }

  const productForm = $('#productForm');
  function renderProductPreview() {
    const data=Object.fromEntries(new FormData(productForm).entries());
    $('#productPreview').innerHTML=`<div class="preview-product-visual"><span>${escapeHtml(data.badge||'GERMANIA')}</span>${escapeHtml(data.icon||'📦')}</div><div class="preview-product-body"><small>${escapeHtml(data.brand||'Marka')} • ${escapeHtml(data.category||groupNames[data.group]||'Kategoria')}</small><h3>${escapeHtml(data.name||'Nazwa nowej oferty')}</h3><p>${escapeHtml(data.description||'Opis produktu lub usługi pojawi się w tym miejscu podczas uzupełniania formularza.')}</p><strong>${data.price?formatPrice(data.price):'0,00 zł'}</strong></div>`;
  }
  productForm.addEventListener('input',renderProductPreview);
  productForm.addEventListener('change',renderProductPreview);
  productForm.addEventListener('submit',event=>{
    event.preventDefault();
    const data=Object.fromEntries(new FormData(event.currentTarget).entries());
    const items=getCustomProducts();
    items.unshift({id:'custom-p-'+Date.now(),group:data.group,name:data.name.trim(),category:data.category.trim(),brand:data.brand.trim(),price:Number(data.price),oldPrice:data.oldPrice?Number(data.oldPrice):null,stock:Number(data.stock),condition:data.condition.trim()||'Nowe',icon:data.icon.trim()||'📦',badge:data.badge.trim(),description:data.description.trim()});
    saveProducts(items);
    event.currentTarget.reset();
    event.currentTarget.elements.stock.value=1;
    event.currentTarget.elements.condition.value='Nowe';
    event.currentTarget.elements.icon.value='📦';
    renderProductPreview(); renderProducts(); updateStats();
    toast('Oferta została dodana do katalogu.');
  });

  function renderPosts() {
    const items=getCustomPosts();
    $('#customPostCount').textContent=`${items.length} ${items.length===1?'artykuł':'artykułów'}`;
    $('#adminPostList').innerHTML=items.length?items.map(item=>`<div class="admin-row"><div class="admin-row-icon">${escapeHtml(item.icon||'📰')}</div><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.category)} • ${formatDate(item.date)}</p></div><div class="admin-row-actions"><button class="btn btn-danger btn-small" data-delete-post="${escapeHtml(item.id)}">Usuń</button></div></div>`).join(''):'<div class="empty-admin"><div><div style="font-size:2.7rem">▤</div><h3>Magazyn czeka na treść</h3><p>Stwórz pierwszy artykuł w formularzu po lewej.</p></div></div>';
  }

  const postForm=$('#postForm');
  postForm.elements.date.value=new Date().toISOString().slice(0,10);
  function renderPostPreview(){
    const data=Object.fromEntries(new FormData(postForm).entries());
    $('#postPreview').innerHTML=`<span class="preview-icon">${escapeHtml(data.icon||'📰')}</span><small>${escapeHtml(data.category||'Kategoria')} • ${data.date?formatDate(data.date):'Data publikacji'}</small><h3>${escapeHtml(data.title||'Tytuł nowego artykułu')}</h3><p>${escapeHtml(data.lead||'Krótki wstęp pojawi się tutaj podczas tworzenia publikacji.')}</p>`;
  }
  postForm.addEventListener('input',renderPostPreview);
  postForm.addEventListener('change',renderPostPreview);
  postForm.addEventListener('submit',event=>{
    event.preventDefault();
    const data=Object.fromEntries(new FormData(event.currentTarget).entries());
    const items=getCustomPosts();
    items.unshift({id:'custom-n-'+Date.now(),title:data.title.trim(),category:data.category.trim(),date:data.date,icon:data.icon.trim()||'📰',lead:data.lead.trim(),content:data.content.trim(),cover:'linear-gradient(135deg,#202936,#4d2025)'});
    savePosts(items);
    event.currentTarget.reset();
    event.currentTarget.elements.date.value=new Date().toISOString().slice(0,10);
    event.currentTarget.elements.icon.value='📰';
    renderPostPreview(); renderPosts(); updateStats();
    toast('Artykuł został opublikowany.');
  });

  function renderMessages() {
    let items=getMessages();
    const q=messageQuery.trim().toLowerCase();
    if(q) items=items.filter(m=>[m.subject,m.name,m.email,m.message].join(' ').toLowerCase().includes(q));
    $('#messageList').innerHTML=items.length?items.map(m=>`<article class="message-card ${m.status==='unread'?'unread':''}" data-message-card="${escapeHtml(m.id)}"><div class="message-head"><div><span class="status-dot ${m.status}">${m.status==='unread'?'Nowa':m.status==='replied'?'Odpowiedziano':'Przeczytana'}</span><h3 style="margin-top:8px">${escapeHtml(m.subject)}</h3><div class="message-meta">${escapeHtml(m.name)} • <a href="mailto:${encodeURIComponent(m.email)}">${escapeHtml(m.email)}</a>${m.phone?' • '+escapeHtml(m.phone):''} • ${formatDate(m.date)}</div></div><button class="btn btn-secondary btn-small" data-toggle-message="${escapeHtml(m.id)}">Otwórz</button></div><div class="message-content">${escapeHtml(m.message)}</div><div class="message-reply"><label>Treść odpowiedzi</label><textarea class="textarea" data-reply-body="${escapeHtml(m.id)}" placeholder="Napisz odpowiedź...">${escapeHtml(m.reply||'')}</textarea><div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:10px"><button class="btn btn-primary btn-small" data-send-reply="${escapeHtml(m.id)}">Otwórz e-mail i oznacz jako odpisane</button><button class="btn btn-secondary btn-small" data-save-reply="${escapeHtml(m.id)}">Zapisz szkic</button><button class="btn btn-danger btn-small" data-delete-message="${escapeHtml(m.id)}">Usuń</button></div></div></article>`).join(''):`<div class="empty-admin"><div><div style="font-size:3rem">✉</div><h3>${q?'Brak wyników':'Skrzynka jest pusta'}</h3><p>${q?'Zmień szukaną frazę.':'Wiadomości pojawią się po wysłaniu formularza kontaktowego.'}</p></div></div>`;
  }

  function updateMessageData(id, updater) {
    const items=getMessages();
    const index=items.findIndex(m=>String(m.id)===String(id));
    if(index<0)return null;
    items[index]=updater(items[index]);
    saveMessages(items);
    return items[index];
  }

  document.addEventListener('click',event=>{
    const deleteProduct=event.target.closest('[data-delete-product]');
    if(deleteProduct && confirm('Usunąć tę ofertę?')){saveProducts(getCustomProducts().filter(i=>String(i.id)!==deleteProduct.dataset.deleteProduct));renderProducts();updateStats();toast('Oferta została usunięta.');}
    const deletePost=event.target.closest('[data-delete-post]');
    if(deletePost && confirm('Usunąć ten artykuł?')){savePosts(getCustomPosts().filter(i=>String(i.id)!==deletePost.dataset.deletePost));renderPosts();updateStats();toast('Artykuł został usunięty.');}

    const toggle=event.target.closest('[data-toggle-message]');
    if(toggle){
      const card=document.querySelector(`[data-message-card="${CSS.escape(toggle.dataset.toggleMessage)}"]`);
      const open=!card.classList.contains('open');
      card.classList.toggle('open',open);
      toggle.textContent=open?'Zamknij':'Otwórz';
      if(open && card.classList.contains('unread')){
        updateMessageData(toggle.dataset.toggleMessage,m=>({...m,status:'read'}));
        card.classList.remove('unread');
        card.querySelector('.status-dot').className='status-dot read';
        card.querySelector('.status-dot').textContent='Przeczytana';
        updateStats();
      }
    }
    const save=event.target.closest('[data-save-reply]');
    if(save){const body=document.querySelector(`[data-reply-body="${CSS.escape(save.dataset.saveReply)}"]`).value;updateMessageData(save.dataset.saveReply,m=>({...m,reply:body}));toast('Szkic odpowiedzi zapisany.');}
    const send=event.target.closest('[data-send-reply]');
    if(send){const id=send.dataset.sendReply;const m=getMessages().find(x=>String(x.id)===String(id));if(!m)return;const body=document.querySelector(`[data-reply-body="${CSS.escape(id)}"]`).value;updateMessageData(id,x=>({...x,reply:body,status:'replied'}));updateStats();renderMessages();location.href=`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Re: '+m.subject)}&body=${encodeURIComponent(body)}`;}
    const del=event.target.closest('[data-delete-message]');
    if(del && confirm('Usunąć tę wiadomość?')){saveMessages(getMessages().filter(m=>String(m.id)!==del.dataset.deleteMessage));renderMessages();updateStats();toast('Wiadomość została usunięta.');}
  });

  $('#markAllRead').addEventListener('click',()=>{saveMessages(getMessages().map(m=>({...m,status:m.status==='unread'?'read':m.status})));renderMessages();updateStats();toast('Wszystkie wiadomości oznaczono jako przeczytane.');});
  $('#messageSearch').addEventListener('input',event=>{messageQuery=event.target.value;renderMessages();});

  renderProductPreview(); renderPostPreview(); renderProducts(); renderPosts(); renderMessages(); updateStats();
  const initialHash=location.hash.replace('#','');
  if(['dashboard','products','posts','messages'].includes(initialHash)) switchView(initialHash);
})();
