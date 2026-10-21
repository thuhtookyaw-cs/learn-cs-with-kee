const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
const bits = [...document.querySelectorAll('.bit')];
bits.forEach(bit => bit.addEventListener('click', () => {
  const active = bit.getAttribute('aria-pressed') !== 'true';
  bit.setAttribute('aria-pressed', String(active));
  bit.classList.toggle('active', active);
  bit.textContent = active ? '1' : '0';
  const values = bits.filter(item => item.getAttribute('aria-pressed') === 'true').map(item => Number(item.dataset.bit));
  document.querySelector('#sum-expression').textContent = values.join(' + ') || '0';
  document.querySelector('#sum-result').textContent = values.reduce((sum, value) => sum + value, 0);
}));
const message = document.querySelector('#student-message');
message.addEventListener('input', () => document.querySelector('#message-count').textContent = message.value.length);
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#student-name').value.trim();
  const text = message.value.trim();
  if (!name || !text) return;
  window.location.assign(`https://t.me/xkxxee?text=${encodeURIComponent(`Hi Kee! I'm ${name}.\n\n${text}`)}`);
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Match the homepage navigation to the section currently being read.
const sectionLinks = [...document.querySelectorAll('#navigation [data-home-section]')];
const homeSections = sectionLinks.map(link => document.getElementById(link.dataset.homeSection)).filter(Boolean);
if (homeSections.length && 'IntersectionObserver' in window) {
  const visibleSections = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.boundingClientRect.top);
      else visibleSections.delete(entry.target.id);
    });
    const active = [...visibleSections].sort((a, b) => a[1] - b[1])[0]?.[0];
    if (!active) return;
    sectionLinks.forEach(link => {
      if (link.dataset.homeSection === active) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin:'-90px 0px -50% 0px',threshold:0});
  homeSections.forEach(section => observer.observe(section));
}
