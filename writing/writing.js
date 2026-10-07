(() => {
  const root = document.documentElement;
  try { root.dataset.theme = localStorage.getItem('writing-theme') || 'light'; } catch (_) {}
  const toggle = document.querySelector('[data-theme-toggle]');
  const updateTheme = () => {
    if (!toggle) return;
    const dark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    toggle.setAttribute('aria-pressed', String(dark));
  };
  updateTheme();
  if (toggle) toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('writing-theme', next); } catch (_) {}
    updateTheme();
  });
  document.querySelectorAll('[data-copy-code]').forEach(button => button.addEventListener('click', async () => {
    const code = button.closest('.code-block').querySelector('code').innerText;
    try { await navigator.clipboard.writeText(code); button.textContent = 'Copied'; setTimeout(() => { button.textContent = 'Copy'; }, 1400); }
    catch { button.textContent = 'Select to copy'; }
  }));
  document.querySelectorAll('.article-figure img').forEach((image, index) => {
    if (image.alt.trim()) return;
    const caption = image.closest('figure')?.nextElementSibling;
    const description = caption?.tagName === 'P' && /^Figure\s/i.test(caption.textContent.trim())
      ? caption.textContent.trim()
      : `Figure ${index + 1} from this article`;
    image.alt = description;
  });
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
