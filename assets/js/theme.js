(() => {
  const root = document.documentElement;
  try { root.dataset.theme = localStorage.getItem('writing-theme') || 'light'; } catch (_) {}
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  const update = () => {
    const dark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    toggle.setAttribute('aria-pressed', String(dark));
  };
  update();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('writing-theme', root.dataset.theme); } catch (_) {}
    update();
  });
})();
