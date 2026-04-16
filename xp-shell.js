const XP_PAGES = [
  { label: 'home',       path: '/my-page/' },
  { label: 'live',       path: '/my-page/live.html' },
  { label: 'blog',       path: '/my-page/blogposts/' },
  { label: 'listening',  path: '/my-page/listening.html' },
  { label: 'colophon',   path: '/my-page/colophon.html' },
];

function xpCurrentPage() {
  const path = location.pathname;
  for (const p of XP_PAGES) {
    if (path === p.path || path.startsWith(p.path.replace(/\/$/, ''))) return p.label;
  }
  return '';
}

function xpTimeStr() {
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + String(m).padStart(2,'0') + ' ' + ap;
}

function xpInject(opts = {}) {
  const { title = document.title, icon = 'page' } = opts;
  const active = xpCurrentPage();

  const navItems = XP_PAGES.map(p =>
    `<a class="xp-nav-item${active===p.label?' active':''}" href="${p.path}">${p.label}</a>`
  ).join('');

  const shell = document.createElement('div');
  shell.id = 'xp-shell';
  shell.innerHTML = `
    <div class="xp-bar">
      <div class="xp-start-btn" id="xp-start" onclick="xpToggleStart()">
        <div class="xp-orb"></div>start
      </div>
      <div class="xp-divider"></div>
      <div class="xp-nav">${navItems}</div>
      <div class="xp-clock" id="xp-clock">${xpTimeStr()}</div>
    </div>
    <div class="xp-start-menu" id="xp-start-menu">
      <div class="xp-sm-header">
        <div class="xp-sm-avatar">S</div>
        <div class="xp-sm-name">segfault</div>
      </div>
      <div class="xp-sm-body">
        <div class="xp-sm-col">
          ${XP_PAGES.map(p=>`<a class="xp-sm-item" href="${p.path}"><div class="xp-sm-icon"></div>${p.label}</a>`).join('')}
        </div>
        <div class="xp-sm-col xp-sm-col-right">
          <a class="xp-sm-item" href="/my-page/inow/"><div class="xp-sm-icon"></div>iNow</a>
          <a class="xp-sm-item" href="/my-page/guestbook.html"><div class="xp-sm-icon"></div>guestbook</a>
          <a class="xp-sm-item" href="/my-page/blogposts/editor.html"><div class="xp-sm-icon"></div>new post</a>
          <div class="xp-sm-divider"></div>
          <a class="xp-sm-item" href="https://github.com/therealsegfault" target="_blank"><div class="xp-sm-icon"></div>github</a>
        </div>
      </div>
      <div class="xp-sm-footer">
        <button class="xp-sm-footer-btn" onclick="xpToggleStart()">close</button>
      </div>
    </div>
    <div class="xp-desktop">
      <div class="xp-window">
        <div class="xp-titlebar">
          <div class="xp-win-icon xp-icon-${icon}"></div>
          <div class="xp-win-title">${title}</div>
          <div class="xp-win-btns">
            <div class="xp-win-btn xp-min">_</div>
            <div class="xp-win-btn xp-max">□</div>
            <div class="xp-win-btn xp-close" onclick="history.back()">×</div>
          </div>
        </div>
        <div id="xp-content-area"></div>
      </div>
    </div>
  `;

  document.body.prepend(shell);

  const content = document.getElementById('xp-page-content');
  if (content) {
    document.getElementById('xp-content-area').appendChild(content);
    content.style.display = 'block';
  }

  setInterval(() => {
    document.getElementById('xp-clock').textContent = xpTimeStr();
  }, 1000);

  document.addEventListener('click', e => {
    if (!e.target.closest('#xp-start-menu') && !e.target.closest('#xp-start')) {
      document.getElementById('xp-start-menu').classList.remove('open');
    }
  });
}

function xpToggleStart() {
  document.getElementById('xp-start-menu').classList.toggle('open');
}
