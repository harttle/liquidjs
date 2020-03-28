{% if page.layout === 'playground' %}
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-min/ace.js"></script>
{% endif %}

{{ js('js/main') }}

{% if config.algolia[page.lang] %}
<script src="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js"></script>
<script>
document.getElementById('search-input-wrap').classList.add('on');
docsearch({
  apiKey: '{{ config.algolia[page.lang].api_key }}',
  indexName: '{{ config.algolia[page.lang].index_name }}',
  inputSelector: '#search-input'
});
</script>
{% endif %}
