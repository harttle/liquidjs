<header id="header" class="wrapper">
  <div id="header-inner" class="inner">
    <h1 id="logo-wrap">
      <a href="{{ url_for_lang('/') }}" id="logo">LiquidJS</a>
    </h1>
    <nav id="main-nav">
      {{ header_menu('main-nav') }}
      <div id="search-input-wrap">
        <i id="search-input-icon" class="icon-search"></i>
        <input type="search" id="search-input" placeholder="{{__('menu.search')}}...">
      </div>
    </nav>
    <div id="lang-select-wrap" class="main-nav-link">
      <label><i class="icon-network"></i>{{ lang_name(page.lang) }}</label>
      <select id="lang-select" data-canonical="{{ canonical_path_for_nav() }}">
        {% for lang in site.data.languages %}
          <option value="{{ loop.key }}"{% if page.lang === loop.key %} selected{% endif %}>{{ lang_name(loop.key) }}</option>
        {% endfor %}
      </select>
    </div>
    <a href="https://github.com/{{ config.github }}" id="github-link-wrap" class="main-nav-link"><i class="icon-github"></i>Github</a>
    <a id="mobile-nav-toggle">
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
    </a>
  </div>
</header>
