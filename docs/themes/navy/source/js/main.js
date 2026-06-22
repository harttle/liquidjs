(function() {
  // mobile nav
  // var body = document.getElementsByTagName('body')[0];
  var html = document.getElementsByTagName('html')[0];
  var navToggle = document.getElementById('mobile-nav-toggle');
  var dimmer = document.getElementById('mobile-nav-dimmer');
  var CLASS_NAME = 'mobile-nav-on';
  if (!navToggle) return;

  navToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    // body.classList.toggle(CLASS_NAME);
    html.classList.toggle(CLASS_NAME);
  });

  dimmer.addEventListener('click', function(e) {
    if (!html.classList.contains(CLASS_NAME)) return;

    e.preventDefault();
    html.classList.remove(CLASS_NAME);
  });
}());

(function() {
  // article toc
  var tocList = document.getElementById('article-toc-inner-list');
  if (!tocList) return;

  window.addEventListener('resize', setMaxHeight);
  setMaxHeight();

  function setMaxHeight() {
    var maxHeight = window.innerHeight - 45;
    tocList.style['max-height'] = maxHeight + 'px';
  }
}());

(function() {
  // playground
  /* global liquidjs, ace */
  if (!location.pathname.match(/playground.html$/)) return;
  updateVersion(liquidjs.version);
  const engine = new liquidjs.Liquid({
    memoryLimit: 1e5,
    renderLimit: 1e5
  });
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const editor = createEditor('editorEl', 'liquid');
  const dataEditor = createEditor('dataEl', 'json');
  const preview = createEditor('previewEl', 'html');
  preview.setReadOnly(true);
  preview.renderer.setShowGutter(false);
  preview.renderer.setPadding(16);

  const editors = [editor, dataEditor, preview];
  colorScheme.addEventListener('change', function() {
    editors.forEach(applyEditorTheme);
  });

  const init = parseArgs(location.hash.slice(1));
  if (init) {
    editor.setValue(init.tpl, 1);
    dataEditor.setValue(init.data, 1);
  }
  editor.on('change', update);
  dataEditor.on('change', update);
  update();
  ready();

  function ready() {
    const loader = document.querySelector('.loader');
    loader.classList.add('hide');
    loader.setAttribute('aria-busy', false);

    const editorsEl = document.querySelector('#editors');
    editorsEl.classList.remove('hide');
    editorsEl.setAttribute('aria-hide', false);
    editors.forEach(function(ed) { ed.resize(); });
  }

  function getEditorTheme() {
    return colorScheme.matches
      ? 'ace/theme/tomorrow_night_eighties'
      : 'ace/theme/github';
  }

  function applyEditorTheme(editor) {
    editor.setTheme(getEditorTheme());
  }

  function createEditor(id, lang) {
    const editor = ace.edit(id);
    applyEditorTheme(editor);
    editor.setOptions({
      fontFamily: '"Source Code Pro", ui-monospace, Monaco, Menlo, Consolas, monospace',
      fontSize: '14px',
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      scrollPastEnd: 0.25
    });
    editor.getSession().setMode('ace/mode/' + lang);
    editor.renderer.setScrollMargin(8, 8, 0, 0);
    return editor;
  }

  function parseArgs(hash) {
    if (!hash) return;
    try {
      let [tpl, data] = hash.split(',').map(atou);
      data = data || '{}';
      return { tpl, data };
    } catch (e) {}
  }

  function serializeArgs(obj) {
    return utoa(obj.tpl) + ',' + utoa(obj.data);
  }

  async function update() {
    const tpl = editor.getValue();
    const data = dataEditor.getValue();
    history.replaceState({}, '', '#' + serializeArgs({tpl, data}));
    try {
      const html = await engine.parseAndRender(tpl, JSON.parse(data));
      preview.setValue(html, 1);
    } catch (err) {
      preview.setValue(err.stack, 1);
      throw err;
    }
  }

  function atou(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  function utoa(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  
  function updateVersion(version) {
    document.querySelector('.version').innerHTML =
      'liquidjs@<a target="_blank" rel="noopener noreferrer" href="https://www.npmjs.com/package/liquidjs/v/' + version + '">' + version + '</a>';
  }
}());

(function() {
  // GitHub star count
  var el = document.getElementById('gh-star-count');
  if (!el) return;
  el.textContent = '1.8K';
  if (!window.fetch) return;

  fetch('https://api.github.com/repos/harttle/liquidjs')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (typeof data.stargazers_count === 'number') {
        el.textContent = format(data.stargazers_count);
      }
    });

  function format(n) {
    if (n < 1000) return String(n);
    var k = n / 1000;
    return (k >= 10 ? Math.round(k) : Math.round(k * 10) / 10) + 'k';
  }
}());

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      console.log('ServiceWorker registration successful with scope: ', reg.scope);
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
