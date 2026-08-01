(() => {
  const EXPECTED_HASH = '124c6f9415130551755fb58656082d633c304ac6e51e024fe62643ecfcdfcc60';
  const form = document.getElementById('loginForm');
  const status = document.getElementById('loginStatus');
  const passwordInput = document.getElementById('password');
  const submit = document.getElementById('loginSubmit');
  const toggle = document.getElementById('togglePassword');

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const buffer = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  toggle?.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    toggle.textContent = show ? '◌' : '◉';
    toggle.setAttribute('aria-label', show ? 'Ukryj hasło' : 'Pokaż hasło');
    passwordInput.focus();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.className = 'login-status';
    status.textContent = '';
    submit.classList.add('loading');
    submit.disabled = true;
    const original = submit.querySelector('span').textContent;
    submit.querySelector('span').textContent = 'Weryfikacja dostępu';

    try {
      const hash = await sha256(passwordInput.value);
      await new Promise(resolve => setTimeout(resolve, 380));
      if (hash !== EXPECTED_HASH) {
        status.textContent = 'Dostęp odrzucony. Sprawdź hasło i spróbuj ponownie.';
        form.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:360,easing:'ease-out'});
        passwordInput.select();
        return;
      }
      status.classList.add('success');
      status.textContent = 'Dostęp przyznany. Uruchamiam Control Room…';
      sessionStorage.setItem('germania_admin_session', JSON.stringify({token:crypto.randomUUID(),expires:Date.now()+4*60*60*1000}));
      document.querySelector('.login-shell')?.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.97)'}],{duration:420,fill:'forwards',easing:'ease-in'});
      setTimeout(()=>location.href='panel.html',430);
    } catch (error) {
      status.textContent = 'Przeglądarka nie obsługuje wymaganej funkcji bezpieczeństwa.';
    } finally {
      submit.classList.remove('loading');
      submit.disabled = false;
      submit.querySelector('span').textContent = original;
    }
  });
})();
