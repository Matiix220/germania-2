(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) {
      window.GERMANIA_UTILS.toast('Uzupełnij imię, e-mail i treść wiadomości.','error');
      return;
    }
    const messages = JSON.parse(localStorage.getItem('germania_messages') || '[]');
    messages.unshift({
      id: 'm' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'Zapytanie ze strony',
      message: data.message,
      date: new Date().toISOString(),
      status: 'unread',
      reply: ''
    });
    localStorage.setItem('germania_messages', JSON.stringify(messages));
    form.reset();
    window.GERMANIA_UTILS.toast('Wiadomość została zapisana. Odpowiemy najszybciej jak to możliwe.');
  });
})();
