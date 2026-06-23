{% if page.layout === 'playground' %}
{{ js('js/liquid.browser.min.js') }}
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.22.0/src-min/ace.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.22.0/src-min/mode-liquid.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.22.0/src-min/mode-json.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.22.0/src-min/mode-html.js"></script>
<script>ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.22.0/src-min/');</script>
{% endif %}

{{ js('js/main') }}

<script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script>
document.getElementById('search-input-wrap').classList.add('on');
docsearch({
appId: '{{ config.algolia.applicationID }}',
apiKey: '{{ config.algolia.apiKey }}',
indexName: 'liquidjs',
inputSelector: '#search-input',
debug: false
});
</script>

<script async src="https://www.googletagmanager.com/gtag/js?id=G-GM713991QQ"></script>
<script type="text/plain" data-category="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-GM713991QQ');
</script>