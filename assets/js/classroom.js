(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    });
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0f1715' : '#f6f5f0';
  }
  syncTheme();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('writing-theme', root.dataset.theme); } catch (_) {}
    syncTheme();
  });
  // The desktop sidebar is replaced by a compact, accessible menu on small screens.
  const menu = document.querySelector('.mobile-menu');
  const side = document.querySelector('.classroom-side');
  const nav = document.querySelector('.classroom-nav');
  const closeMenu = () => { side.removeAttribute('data-menu-open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    side.toggleAttribute('data-menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  // The theme remains available on mobile inside the expanded navigation.
  const mobileTheme = toggle.cloneNode(true);
  mobileTheme.classList.add('mobile-theme');
  mobileTheme.addEventListener('click', () => { toggle.click(); mobileTheme.setAttribute('aria-label', toggle.getAttribute('aria-label')); mobileTheme.setAttribute('aria-pressed', toggle.getAttribute('aria-pressed')); });
  nav.append(mobileTheme);
  syncTheme();

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...nav.querySelectorAll('a')];
  function syncNavigation() {
    let active = sections[0];
    const offset = innerWidth <= 900 ? 180 : 170;
    for (const section of sections) if (section.getBoundingClientRect().top <= offset) active = section;
    navLinks.forEach(link => {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (!scrollPending) requestAnimationFrame(() => { syncNavigation(); scrollPending = false; });
    scrollPending = true;
  }, { passive: true });
  syncNavigation();

  const filters = [...document.querySelectorAll('[data-filter]')];
  const tracks = [...document.querySelectorAll('.track[data-kind]')];
  const groups = [...document.querySelectorAll('.path-group')];
  const search = document.querySelector('#resource-search');
  const status = document.querySelector('.library-filter-status');
  let filter = 'all';
  const defaultOpen = groups.map(group => group.open);
  function filterResources() {
    const query = search.value.trim().toLocaleLowerCase();
    let visibleCount = 0;
    tracks.forEach(track => {
      track.hidden = (filter !== 'all' && track.dataset.kind !== filter) || !track.textContent.toLocaleLowerCase().includes(query);
      if (!track.hidden) visibleCount++;
    });
    groups.forEach((group, index) => {
      const visible = [...group.querySelectorAll('.track')].filter(track => !track.hidden).length;
      group.hidden = !visible;
      group.querySelector('.path-count').textContent = `${visible} ${visible === 1 ? 'resource' : 'resources'}`;
      group.open = query || filter !== 'all' ? !!visible : defaultOpen[index];
    });
    status.textContent = `Showing ${visibleCount} of ${tracks.length} resources${query ? ` matching “${search.value.trim()}”` : ''}`;
    document.querySelector('.empty-library').hidden = visibleCount !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filterResources();
  }));
  search.addEventListener('input', filterResources);
  filterResources();

})();
