/* =========================================================
   Next.js App Router · Playground — app.js
   ========================================================= */

(() => {
  'use strict';

  const TOTAL = 14;
  const state = {
    current: 1,
    visited: new Set([1]),
    auth: false,
  };

  // ---------- NAVIGATION ----------
  const steps = document.querySelectorAll('.step');
  const stepperItems = document.querySelectorAll('.stepper li');
  const progressFill = document.getElementById('progressFill');
  const progressNum = document.getElementById('progressNum');

  function goTo(n) {
    n = Math.max(1, Math.min(TOTAL, n));
    state.current = n;
    state.visited.add(n);

    steps.forEach(s => {
      s.hidden = parseInt(s.dataset.step, 10) !== n;
    });

    stepperItems.forEach(li => {
      const sn = parseInt(li.dataset.step, 10);
      li.classList.toggle('active', sn === n);
      li.classList.toggle('done', state.visited.has(sn) && sn !== n);
    });

    const pct = (state.visited.size / TOTAL) * 100;
    progressFill.style.width = pct + '%';
    progressNum.textContent = state.visited.size;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  stepperItems.forEach(li => {
    li.addEventListener('click', () => goTo(parseInt(li.dataset.step, 10)));
  });

  document.querySelectorAll('[data-next]').forEach(b => {
    b.addEventListener('click', () => goTo(state.current + 1));
  });

  document.querySelectorAll('[data-prev]').forEach(b => {
    b.addEventListener('click', () => goTo(state.current - 1));
  });

  // ---------- STEP 2: TERMINAL ----------
  const termBody = document.getElementById('terminalBody');
  const termForm = document.getElementById('terminalForm');
  const termInput = document.getElementById('terminalInput');
  const checklist = document.querySelectorAll('.term-checklist li');
  const termState = { cwd: '~/projects', inApp: false };

  function termOut(text, cls = '') {
    const line = document.createElement('div');
    line.className = 'term-line out' + (cls ? ' ' + cls : '');
    line.textContent = text;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function termEcho(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="prompt">❯</span> ${escapeHtml(cmd)}`;
    termBody.appendChild(line);
  }

  function markCheck(key) {
    checklist.forEach(li => {
      if (li.dataset.check === key) li.classList.add('done');
    });
  }

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    termEcho(cmd);

    if (cmd === 'clear' || cmd === 'cls') {
      termBody.innerHTML = '<div class="term-line"><span class="prompt">❯</span> <span class="comment"># Terminal limpiada</span></div>';
      return;
    }

    if (cmd === 'help') {
      termOut('Comandos disponibles:');
      termOut('  npx create-next-app@latest <nombre>   Crea un proyecto');
      termOut('  cd <carpeta>                          Cambia de directorio');
      termOut('  npm run dev                           Arranca el servidor');
      termOut('  ls                                    Lista ficheros');
      termOut('  pwd                                   Muestra el directorio');
      termOut('  clear                                 Limpia la terminal');
      return;
    }

    if (cmd === 'pwd') {
      termOut(termState.cwd);
      return;
    }

    if (cmd === 'ls') {
      if (termState.inApp) {
        termOut('app/  public/  node_modules/  package.json  next.config.js  tsconfig.json');
      } else {
        termOut('my-app/');
      }
      return;
    }

    const createMatch = cmd.match(/^npx\s+create-next-app(@[\w.-]+)?\s+(\S+)/);
    if (createMatch) {
      const name = createMatch[2];
      termOut(`✔ Creando proyecto "${name}"…`);
      setTimeout(() => termOut('  ✔ Instalando dependencias'), 200);
      setTimeout(() => termOut('  ✔ Inicializando git'), 500);
      setTimeout(() => {
        termOut(`¡Listo! Ejecuta "cd ${name}" para empezar.`, 'success');
        markCheck('create');
      }, 800);
      return;
    }

    const cdMatch = cmd.match(/^cd\s+(\S+)/);
    if (cdMatch) {
      const target = cdMatch[1];
      if (target === '..') {
        termState.cwd = '~/projects';
        termState.inApp = false;
      } else {
        termState.cwd = '~/projects/' + target;
        termState.inApp = true;
        markCheck('cd');
      }
      termOut('(cwd → ' + termState.cwd + ')');
      return;
    }

    if (/^npm\s+run\s+dev$/.test(cmd) || cmd === 'next dev') {
      if (!termState.inApp) {
        termOut('Error: no hay package.json aquí. ¿Olvidaste `cd my-app`?', 'error');
        return;
      }
      termOut('▲ Next.js 15.x');
      setTimeout(() => termOut('  - Local:    http://localhost:3000'), 250);
      setTimeout(() => termOut('  - Network:  http://192.168.1.12:3000'), 400);
      setTimeout(() => {
        termOut('✓ Compilado con éxito en 1.2s', 'success');
        markCheck('dev');
      }, 700);
      return;
    }

    termOut(`zsh: command not found: ${cmd.split(' ')[0]}`, 'error');
  }

  termForm?.addEventListener('submit', e => {
    e.preventDefault();
    runCommand(termInput.value);
    termInput.value = '';
  });

  document.querySelectorAll('.chip[data-cmd]').forEach(b => {
    b.addEventListener('click', () => {
      termInput.value = b.dataset.cmd;
      termInput.focus();
    });
  });

  // ---------- STEP 3: FILE TREE ----------
  const treeInfo = document.getElementById('treeInfo');
  const treeNodes = document.querySelectorAll('#fileTree .node');

  const TREE_CONTENT = {
    'root':        { label: 'Carpeta del proyecto',   title: 'my-app/',                   body: 'La raíz del proyecto creado por <code>create-next-app</code>. Contiene código, configuración y dependencias.' },
    'app':         { label: 'Corazón del routing',     title: 'app/',                      body: 'Aquí vive el <strong>App Router</strong>. Cada carpeta dentro de <code>app/</code> representa un segmento de ruta.' },
    'layout-root': { label: 'Layout raíz · OBLIGATORIO', title: 'app/layout.tsx',          body: 'Envuelve <strong>toda la app</strong>. Define <code>&lt;html&gt;</code> y <code>&lt;body&gt;</code>. Es el único <code>layout</code> obligatorio.' },
    'page-root':   { label: 'Página raíz',            title: 'app/page.tsx',               body: 'Renderiza la UI de <code>/</code>. Sin este fichero, la raíz no es navegable.' },
    'globals':     { label: 'Estilos globales',        title: 'app/globals.css',           body: 'CSS global importado desde el layout raíz. Buen sitio para <code>@tailwind</code> directives o resets.' },
    'about':       { label: 'Segmento de ruta',        title: 'app/about/',                body: 'Crea la ruta <code>/about</code>. Haz doble clic para abrir.' },
    'page-about':  { label: 'Página /about',           title: 'app/about/page.tsx',        body: 'Renderiza la UI de <code>/about</code>.' },
    'blog':        { label: 'Segmento de ruta',        title: 'app/blog/',                 body: 'Contiene la página del listado y el segmento dinámico <code>[slug]</code>.' },
    'layout-blog': { label: 'Layout de sección',       title: 'app/blog/layout.tsx',       body: 'Envuelve a <code>/blog</code> y todas sus rutas hijas. Se mantiene al navegar entre posts.' },
    'page-blog':   { label: 'Índice del blog',         title: 'app/blog/page.tsx',         body: 'Renderiza la UI de <code>/blog</code> (típicamente, el listado de posts).' },
    'slug':        { label: 'Segmento dinámico',       title: 'app/blog/[slug]/',          body: 'Captura cualquier valor en esa posición y lo entrega como <code>params.slug</code>.' },
    'page-slug':   { label: 'Página de post',          title: 'app/blog/[slug]/page.tsx',  body: 'Recibe <code>params</code> con el slug concreto de la URL.' },
    'public':      { label: 'Assets estáticos',        title: 'public/',                   body: 'Ficheros servidos tal cual desde la raíz: <code>/favicon.ico</code>, <code>/logo.png</code>, etc.' },
    'nextconfig':  { label: 'Configuración',           title: 'next.config.js',            body: 'Opciones de Next.js: redirecciones, imágenes, <em>rewrites</em>, i18n, experimental flags…' },
    'pkg':         { label: 'Dependencias',            title: 'package.json',              body: 'Scripts <code>dev</code>, <code>build</code>, <code>start</code> y el resto de dependencias del proyecto.' },
  };

  treeNodes.forEach(node => {
    node.addEventListener('click', e => {
      e.stopPropagation();
      treeNodes.forEach(n => n.classList.remove('selected'));
      node.classList.add('selected');

      if (node.classList.contains('folder')) {
        node.classList.toggle('open');
        const twisty = node.querySelector('.twisty');
        const ul = node.querySelector(':scope > ul');
        if (ul) ul.hidden = !node.classList.contains('open');
        if (twisty) twisty.textContent = node.classList.contains('open') ? '▾' : '▸';
      }

      const info = TREE_CONTENT[node.dataset.info];
      if (info) {
        treeInfo.innerHTML = `
          <div class="info-label">${info.label}</div>
          <h3 class="info-title">${info.title}</h3>
          <p class="info-body">${info.body}</p>
        `;
      }
    });
  });

  // ---------- STEP 5: ROUTE TESTER ----------
  const routeForm = document.getElementById('routeForm');
  const routeInput = document.getElementById('routeInput');
  const routeResult = document.getElementById('routeResult');

  const ROUTES = [
    { pattern: /^\/$/,                     file: 'app/page.tsx',               params: () => ({}) },
    { pattern: /^\/about$/,                file: 'app/about/page.tsx',         params: () => ({}) },
    { pattern: /^\/blog$/,                 file: 'app/blog/page.tsx',          params: () => ({}) },
    { pattern: /^\/blog\/([^/]+)$/,        file: 'app/blog/[slug]/page.tsx',   params: m => ({ slug: m[1] }) },
    { pattern: /^\/shop\/(.+)$/,           file: 'app/shop/[...items]/page.tsx', params: m => ({ items: m[1].split('/') }) },
  ];

  function resolveRoute(path) {
    if (!path.startsWith('/')) path = '/' + path;
    path = path.replace(/\/+$/, '') || '/';

    for (const r of ROUTES) {
      const m = path.match(r.pattern);
      if (m) return { hit: true, file: r.file, params: r.params(m), path };
    }
    return { hit: false, path };
  }

  function renderRouteResult(path) {
    const res = resolveRoute(path);
    if (res.hit) {
      routeResult.innerHTML = `
        <div class="result-row"><span class="k">✓ URL</span><span class="v">${escapeHtml(res.path)}</span></div>
        <div class="result-row result-hit"><span class="k">MATCH</span><span class="v">${escapeHtml(res.file)}</span></div>
        <div class="result-row"><span class="k">params</span><span class="v">${escapeHtml(JSON.stringify(res.params))}</span></div>
        <div class="result-row"><span class="k">render</span><span class="v">200 OK — Server Component</span></div>
      `;
    } else {
      routeResult.innerHTML = `
        <div class="result-row"><span class="k">URL</span><span class="v">${escapeHtml(res.path)}</span></div>
        <div class="result-row result-miss"><span class="k">✗ 404</span><span class="v">No hay page.tsx que case con esta ruta</span></div>
        <div class="result-row"><span class="k">render</span><span class="v">Se mostraría not-found.tsx (o el fallback global)</span></div>
      `;
    }
  }

  routeForm?.addEventListener('submit', e => {
    e.preventDefault();
    renderRouteResult(routeInput.value || '/');
  });

  document.querySelectorAll('.chip[data-route]').forEach(b => {
    b.addEventListener('click', () => {
      routeInput.value = b.dataset.route;
      renderRouteResult(b.dataset.route);
    });
  });

  // ---------- STEP 6: DYNAMIC PARAMS ----------
  const slugInput = document.getElementById('slugInput');
  const slugOutput = document.getElementById('slugOutput');
  const slugRender = document.getElementById('slugRender');

  function updateSlug() {
    const v = slugInput.value || 'hola';
    slugOutput.textContent = `{ slug: "${v}" }`;
    slugRender.textContent = v;
  }

  slugInput?.addEventListener('input', updateSlug);

  // ---------- STEP 7: LAYOUT DEMO ----------
  const layoutPath = document.getElementById('layoutPath');
  const layoutContent = document.getElementById('layoutContent');
  const layoutPage = document.getElementById('layoutPage');

  const LAYOUTS = {
    home:     { path: 'app/dashboard/page.tsx',           content: 'Dashboard home' },
    settings: { path: 'app/dashboard/settings/page.tsx',  content: '⚙️ Settings · ajustes de cuenta' },
    billing:  { path: 'app/dashboard/billing/page.tsx',   content: '💳 Billing · facturación y planes' },
  };

  document.querySelectorAll('[data-layout]').forEach(b => {
    b.addEventListener('click', () => {
      const key = b.dataset.layout;
      const l = LAYOUTS[key];
      layoutPath.textContent = l.path;
      layoutContent.textContent = l.content;
      layoutPage.classList.remove('flash');
      void layoutPage.offsetWidth;
      layoutPage.classList.add('flash');
    });
  });

  // ---------- STEP 8: GROUP DEMO ----------
  document.querySelectorAll('.group-input').forEach(inp => {
    inp.addEventListener('input', () => {
      const answer = inp.dataset.answer.toLowerCase();
      const val = inp.value.trim().toLowerCase();
      const fb = inp.parentElement.querySelector('.group-feedback');
      inp.classList.remove('correct', 'wrong');
      fb.textContent = '';
      if (!val) return;
      if (val === answer) {
        inp.classList.add('correct');
        fb.textContent = '✓';
      } else if (val.length >= answer.length) {
        inp.classList.add('wrong');
        fb.textContent = '✗';
      }
    });
  });

  // ---------- STEP 9: SIMULATOR ----------
  const simScreen = document.getElementById('simScreen');

  const SIM = {
    idle: `<div class="sim-content"><h4>Panel de usuario</h4><p>Bienvenido. Datos listos.</p></div>`,
    loading: `<div class="sim-loading"><div class="spinner"></div><span>loading.tsx · Streaming del segmento…</span></div>`,
    error: `<div class="sim-error"><strong>⚠ Error</strong>Algo falló al cargar el segmento.<br><span style="color:var(--text-mute);font-size:12px;">Client Component capturado por error.tsx</span></div>`,
    notfound: `<div class="sim-notfound">404<small>notFound() · not-found.tsx</small></div>`,
  };

  document.querySelectorAll('[data-sim]').forEach(b => {
    b.addEventListener('click', () => {
      const key = b.dataset.sim;
      simScreen.style.opacity = '0';
      setTimeout(() => {
        simScreen.innerHTML = SIM[key] || SIM.idle;
        simScreen.style.opacity = '1';
      }, 200);
    });
  });

  // ---------- STEP 10: SERVER/CLIENT DECIDER ----------
  document.querySelectorAll('.decider-q').forEach(q => {
    const correct = q.dataset.answer;
    q.querySelectorAll('[data-opt]').forEach(btn => {
      btn.addEventListener('click', () => {
        q.classList.remove('correct', 'wrong');
        q.querySelectorAll('[data-opt]').forEach(b => b.classList.remove('correct-opt', 'wrong-opt'));
        if (btn.dataset.opt === correct) {
          q.classList.add('correct');
          btn.classList.add('correct-opt');
        } else {
          q.classList.add('wrong');
          btn.classList.add('wrong-opt');
          q.querySelector(`[data-opt="${correct}"]`).classList.add('correct-opt');
        }
      });
    });
  });

  // ---------- STEP 11: FETCH EXPLORER ----------
  const fetchCode = document.getElementById('fetchCode');
  const fetchExplain = document.getElementById('fetchExplain');

  const FETCH_MODES = {
    static: {
      code: `const res = await fetch('https://api.example.com/posts')
const posts = await res.json()`,
      explain: 'Por defecto, el resultado se <strong>cachea indefinidamente</strong> en build y se sirve estático. Perfecto para datos que no cambian.'
    },
    revalidate: {
      code: `const res = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60 }
})
const posts = await res.json()`,
      explain: '<strong>ISR (Incremental Static Regeneration):</strong> la página se regenera como máximo cada 60 segundos. Mezcla rendimiento estático con frescura.'
    },
    dynamic: {
      code: `const res = await fetch('https://api.example.com/posts', {
  cache: 'no-store'
})
const posts = await res.json()`,
      explain: '<strong>Dinámico:</strong> el fetch se ejecuta en <em>cada request</em>. Úsalo para datos siempre frescos (sesión, carrito, dashboards en vivo).'
    },
  };

  document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const mode = FETCH_MODES[b.dataset.mode];
      fetchCode.textContent = mode.code;
      fetchExplain.innerHTML = mode.explain;
    });
  });

  // ---------- STEP 12: REDIRECT SIMULATOR ----------
  const toggleAuth = document.getElementById('toggleAuth');
  const authState = document.getElementById('authState');
  const redirLog = document.getElementById('redirLog');

  toggleAuth?.addEventListener('click', () => {
    state.auth = !state.auth;
    authState.textContent = state.auth ? 'autenticado' : 'NO autenticado';
    authState.classList.toggle('authed', state.auth);
    logEntry(`session.user = ${state.auth ? '{ id: 42 }' : 'null'}`);
  });

  function logEntry(text, cls = '') {
    const el = document.createElement('div');
    el.className = 'log-entry' + (cls ? ' ' + cls : '');
    el.innerHTML = text;
    redirLog.appendChild(el);
    redirLog.scrollTop = redirLog.scrollHeight;
  }

  document.querySelectorAll('[data-visit]').forEach(b => {
    b.addEventListener('click', () => {
      const url = b.dataset.visit;
      logEntry(`→ GET <strong>${url}</strong>`);

      if (url === '/dashboard') {
        if (!state.auth) {
          logEntry(`  redirect() <span class="arrow">→</span> <strong>/login</strong>`, 'redirect');
        } else {
          logEntry(`  render <span class="arrow">→</span> DashboardPage`, 'ok');
        }
      } else if (url === '/old-blog/hola') {
        logEntry(`  next.config.js redirects() <span class="arrow">→</span> <strong>/blog/hola</strong> <em>(308)</em>`, 'redirect');
      } else if (url === '/about') {
        logEntry(`  render <span class="arrow">→</span> AboutPage`, 'ok');
      }
    });
  });

  // ---------- STEP 14: QUIZ ----------
  const quizForm = document.getElementById('quizForm');
  const quizResult = document.getElementById('quizResult');
  const scoreNum = document.getElementById('scoreNum');
  const scoreRing = document.getElementById('scoreRing');
  const scoreTitle = document.getElementById('scoreTitle');
  const scoreMsg = document.getElementById('scoreMsg');
  const resetQuiz = document.getElementById('resetQuiz');

  quizForm?.addEventListener('submit', e => {
    e.preventDefault();
    const fieldsets = quizForm.querySelectorAll('fieldset.q');
    let score = 0;
    const total = fieldsets.length;

    fieldsets.forEach((fs, i) => {
      const ans = fs.dataset.answer;
      const picked = fs.querySelector('input:checked');
      fs.classList.remove('correct', 'wrong');
      if (picked && picked.value === ans) {
        score++;
        fs.classList.add('correct');
      } else {
        fs.classList.add('wrong');
      }
    });

    scoreNum.textContent = score;
    const ringTotal = 276.46;
    scoreRing.style.strokeDashoffset = ringTotal - (ringTotal * score / total);

    let title, msg;
    if (score === total) {
      title = '¡Impecable!';
      msg = 'Dominas el App Router. Estás listo/a para construir algo serio.';
    } else if (score >= 6) {
      title = 'Muy bien';
      msg = 'Tienes una base sólida. Repasa las preguntas en rojo y estarás al 100%.';
    } else if (score >= 4) {
      title = 'Vas por buen camino';
      msg = 'Las ideas clave están ahí. Vuelve a los pasos 5–11 para afianzar.';
    } else {
      title = 'A repasar';
      msg = 'Sin prisa: reinicia el playground y haz las demos con calma. Se entiende mejor tocando.';
    }

    scoreTitle.textContent = title;
    scoreMsg.textContent = msg;
    quizResult.hidden = false;
    quizResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  resetQuiz?.addEventListener('click', () => {
    quizForm.reset();
    quizForm.querySelectorAll('fieldset.q').forEach(fs => fs.classList.remove('correct', 'wrong'));
    quizResult.hidden = true;
  });

  document.getElementById('restartAll')?.addEventListener('click', () => {
    state.visited = new Set([1]);
    goTo(1);
  });

  // ---------- KEYBOARD SHORTCUTS ----------
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight') goTo(state.current + 1);
    if (e.key === 'ArrowLeft')  goTo(state.current - 1);
  });

  // ---------- HELPERS ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ---------- INIT ----------
  goTo(1);

})();
