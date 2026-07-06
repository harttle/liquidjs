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
  /* global liquidjs, ace, Prism */
  if (!/\/playground(?:\.html)?$/.test(location.pathname)) return;
  updateVersion(liquidjs.version);
  const engine = new liquidjs.Liquid({
    memoryLimit: 1e5,
    renderLimit: 1e5
  });
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const editor = createEditor('editorEl', 'liquid');
  const dataEditor = createEditor('dataEl', 'json');
  const previewCode = document.getElementById('previewCode');
  const indicatorTpl = document.querySelector('.area-tpl .pane-indicator');
  const indicatorData = document.querySelector('.area-data .pane-indicator');
  const indicatorOutput = document.querySelector('.area-output .pane-indicator');

  const editors = [editor, dataEditor];
  let previewValue = '';
  let hadPreview = false;
  let renderTimer = null;
  const RENDER_DELAY = 180;
  colorScheme.addEventListener('change', function() {
    editors.forEach(applyEditorTheme);
    if (previewValue) setPreview(previewValue);
  });

  const init = parseArgs(location.hash.slice(1));
  if (init) {
    editor.setValue(init.tpl, 1);
    dataEditor.setValue(init.data, 1);
  }
  editor.on('change', onTemplateChange);
  dataEditor.on('change', onContextChange);
  editor.on('focus', function () { setIndicator(indicatorTpl, 'active'); });
  dataEditor.on('focus', function () { setIndicator(indicatorData, 'active'); });
  scheduleUpdate();
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
    editor.renderer.setPadding(0);
    editor.container.style.background = 'transparent';
  }

  function createEditor(id, lang) {
    const editor = ace.edit(id);
    applyEditorTheme(editor);
    editor.setOptions({
      fontFamily: '"Source Code Pro", ui-monospace, Monaco, Menlo, Consolas, monospace',
      fontSize: '14px',
      showPrintMargin: false,
      showGutter: false,
      highlightActiveLine: false,
      tabSize: 2,
      useSoftTabs: true,
      scrollPastEnd: 0
    });
    editor.getSession().setMode('ace/mode/' + lang);
    editor.renderer.setShowGutter(false);
    if (editor.renderer.$gutter) {
      editor.renderer.$gutter.style.display = 'none';
    }
    editor.renderer.setScrollMargin(0, 0, 0, 0);
    bindClipboard(editor);
    return editor;
  }

  function bindClipboard(editor) {
    editor.commands.addCommand({
      name: 'copy',
      bindKey: {win: 'Ctrl-C', mac: 'Command-C'},
      exec: function (ed) {
        const text = ed.getCopyText();
        if (!text) return;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text);
        }
      },
      readOnly: true
    });
    editor.commands.addCommand({
      name: 'cut',
      bindKey: {win: 'Ctrl-X', mac: 'Command-X'},
      exec: function (ed) {
        const text = ed.getCopyText();
        if (!text) return;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () {
            ed.insert('');
          });
        }
      }
    });
    editor.commands.addCommand({
      name: 'paste',
      bindKey: {win: 'Ctrl-V', mac: 'Command-V'},
      exec: function (ed) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.readText().then(function (text) {
            ed.insert(text);
          });
        }
      }
    });
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

  function setPreview(value) {
    previewValue = value;
    previewCode.textContent = value;
    if (window.Prism) {
      delete previewCode.dataset.highlighted;
      window.Prism.highlightElement(previewCode);
    }
  }

  function setIndicator(indicator, state) {
    if (indicator) indicator.dataset.state = state;
  }

  function onTemplateChange() {
    setIndicator(indicatorTpl, 'active');
    if (indicatorData.dataset.state !== 'error') setIndicator(indicatorData, 'idle');
    setIndicator(indicatorOutput, 'pending');
    scheduleUpdate();
  }

  function onContextChange() {
    setIndicator(indicatorData, 'active');
    if (indicatorTpl.dataset.state !== 'error') setIndicator(indicatorTpl, 'idle');
    setIndicator(indicatorOutput, 'pending');
    scheduleUpdate();
  }

  function scheduleUpdate() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(update, RENDER_DELAY);
  }

  async function update() {
    const tpl = editor.getValue();
    const data = dataEditor.getValue();
    history.replaceState({}, '', '#' + serializeArgs({tpl, data}));
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (err) {
      setIndicator(indicatorData, 'error');
      setIndicator(indicatorTpl, 'idle');
      setIndicator(indicatorOutput, 'error');
      return;
    }
    try {
      const html = await engine.parseAndRender(tpl, parsed);
      if (html !== '' || !hadPreview) {
        setPreview(html);
        if (html !== '') hadPreview = true;
      }
      setIndicator(indicatorTpl, 'idle');
      setIndicator(indicatorData, 'idle');
      setIndicator(indicatorOutput, 'ok');
    } catch (err) {
      setIndicator(indicatorTpl, 'error');
      setIndicator(indicatorData, 'idle');
      setIndicator(indicatorOutput, 'error');
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
