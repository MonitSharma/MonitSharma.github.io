(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('writing-theme');
  if (saved) root.dataset.theme = saved;
  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('writing-theme', next);
  });
  document.querySelectorAll('[data-copy-code]').forEach(button => button.addEventListener('click', async () => {
    const code = button.closest('.code-block').querySelector('code').innerText;
    try { await navigator.clipboard.writeText(code); button.textContent = 'Copied'; setTimeout(() => { button.textContent = 'Copy'; }, 1400); }
    catch { button.textContent = 'Select to copy'; }
  }));
  document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
    if (window.matchMedia('(max-width: 700px)').matches) return;
    event.preventDefault();
    const overlay = document.createElement('dialog'); overlay.className = 'writing-lightbox';
    overlay.innerHTML = `<img src="${link.href}" alt="${link.querySelector('img')?.alt || ''}"><button type="button" aria-label="Close image">Close</button>`;
    document.body.appendChild(overlay); overlay.showModal();
    overlay.addEventListener('click', () => { overlay.close(); overlay.remove(); });
  }));
  document.querySelectorAll('.mermaid').forEach(el => {
    const script = document.createElement('script'); script.type = 'module'; script.textContent = `import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'; mermaid.initialize({startOnLoad:false,theme:document.documentElement.dataset.theme==='dark'?'dark':'neutral'}); await mermaid.run({nodes:[document.querySelector('.mermaid')]});`; document.body.appendChild(script);
  });
})();
