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
  // lang select
  function changeLang() {
    var lang = this.value;
    var canonical = this.dataset.canonical;
    var path = '/';
    if (lang !== 'en') path += lang + '/';

    var expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = 'nf_lang=' + lang + ';path=/;expires=' + expires.toGMTString();

    location.href = path + canonical;
  }

  document.getElementById('lang-select').addEventListener('change', changeLang);
  document.getElementById('mobile-lang-select').addEventListener('change', changeLang);
}());

(function() {
  // playground
  /* global liquidjs, ace */
  if (!location.pathname.match(/playground.html$/)) return;
  updateVersion(liquidjs.version);
  const engine = new liquidjs.Liquid();
  const editor = createEditor('editorEl', 'liquid');
  const dataEditor = createEditor('dataEl', 'json');
  const preview = createEditor('previewEl', 'html');
  preview.setReadOnly(true);
  preview.renderer.setShowGutter(false);
  preview.renderer.setPadding(20);

  const init = parseArgs(location.hash.slice(1));
  if (init) {
    editor.setValue(init.tpl, 1);
    dataEditor.setValue(init.data, 1);
  }
  editor.on('change', update);
  dataEditor.on('change', update);
  update();

  function createEditor(id, lang) {
    var editor = ace.edit(id);
    editor.setTheme('ace/theme/tomorrow_night');
    editor.getSession().setMode('ace/mode/' + lang);
    editor.getSession().setOptions({
      tabSize: 2,
      useSoftTabs: true
    });
    editor.renderer.setScrollMargin(15);
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
    document.querySelector('.version').innerHTML = `
      liquidjs@<a target="_blank" href="https://www.npmjs.com/package/liquidjs/v/${version}">${version}</a>
    `
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
