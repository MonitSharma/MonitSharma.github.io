(() => {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('#search-input');
  const status = document.querySelector('[data-search-status]');
  const results = document.querySelector('[data-search-results]');
  let index = [];
  const normalize = value => String(value || '').toLowerCase();
  const articleUrl = url => {
    const match = String(url || '').match(/^\/writing\/([^/]+)\/$/);
    return match ? `../${match[1]}/index.html` : url;
  };
  fetch('../search-index.json').then(response => response.json()).then(data => { index = data; status.textContent = `${index.length} articles indexed.`; render(new URLSearchParams(location.search).get('q') || ''); }).catch(() => { status.textContent = 'Search is unavailable until the generated index loads.'; });
  function render(query) {
    input.value = query;
    const needle = normalize(query).trim();
    const matches = needle ? index.filter(item => normalize([item.title, item.excerpt, item.tags.join(' '), item.series, item.text].join(' ')).includes(needle)).slice(0, 30) : [];
    results.innerHTML = matches.map(item => `<article class="search-result"><h2><a href="${articleUrl(item.url)}">${item.title}</a></h2><p>${item.excerpt}</p><small>${item.date} · ${item.tags.join(' · ')}</small></article>`).join('');
    if (needle) status.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'} for “${query}”.`;
  }
  form.addEventListener('submit', event => { event.preventDefault(); const query = input.value.trim(); history.replaceState(null, '', query ? `?q=${encodeURIComponent(query)}` : location.pathname); render(query); });
})();
