{% if page.layout === 'playground' %}
<script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-min/ace.js"></script>
{% endif %}

{{ js('js/main') }}

<script src="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js"></script>
<script>
document.getElementById('search-input-wrap').classList.add('on');
docsearch({
  apiKey: '{{ config.algolia.apiKey }}',
  indexName: '{{ config.algolia.indexName }}',
  inputSelector: '#search-input'
});
</script>
