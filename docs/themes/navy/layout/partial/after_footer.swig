{% if page.layout === 'playground' %}
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-min/ace.js"></script>
{% endif %}

{{ js('js/main') }}

<script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script>
document.getElementById('search-input-wrap').classList.add('on');
docsearch({
apiKey: '01f36cc168657a26a385308b9e721bc6',
indexName: 'liquidjs',
inputSelector: '#search-input',
debug: false
});
</script>