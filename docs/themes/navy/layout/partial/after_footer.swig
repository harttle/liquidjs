{% if page.layout === 'playground' %}
{{ js('js/liquid.browser.min.js') }}
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.22.0/src-min/ace.js"></script>
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