<nav id="mobile-nav">
  <div id="mobile-nav-inner">
    <ul id="mobile-nav-list">
      {{ header_menu('mobile-nav') }}
    </ul>
    {% if page.layout == 'page' %}
    <div class="mobile-sidebar-list">
      {{ doc_sidebar('mobile-nav') }}
    </div>
    {% endif %}
  </div>
  <div id="mobile-button-list">
    <a href="https://github.com/{{ config.github }}" class="mobile-nav-link" rel="external" target="_blank"><i class="icon-github"></i></a>
    <a href="https://opencollective.com/liquidjs" class="mobile-nav-link" rel="external" target="_blank"><i class="icon-opencollective"></i></a>
    <div id="mobile-lang-select-wrap" class="mobile-nav-link">
      <label for="mobile-lang-select"><i class="icon-network"></i></label>
      <select id="mobile-lang-select" data-canonical="{{ canonical_path_for_nav() }}">
        {% for lang in site.data.languages %}
          <option value="{{ loop.key }}"{% if page.lang === loop.key %} selected{% endif %}>{{ lang_name(loop.key) }}</option>
        {% endfor %}
      </select>
    </div>
  </div>
</nav>