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
    <div class="main-nav-link icon-nav-link">
      <label><i class="icon-network"></i> <span class="icon-nav-title">{{ lang_name(page.lang) }}</span></label>
      <select id="lang-select" data-canonical="{{ canonical_path_for_nav() }}">
        {% for lang in site.data.languages %}
          <option value="{{ loop.key }}"{% if page.lang === loop.key %} selected{% endif %}>{{ lang_name(loop.key) }}</option>
        {% endfor %}
      </select>
    </div>
    <div class="main-nav-link icon-nav-link github-buttons-wrap">
      <a class="github-button" href="https://github.com/harttle/liquidjs" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star harttle/liquidjs on GitHub">Star</a>
      <a class="github-button" href="https://github.com/sponsors/harttle" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Sponsor @harttle on GitHub">Sponsor</a>
    </div>
    <a id="mobile-nav-toggle">
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
      <span class="mobile-nav-toggle-bar"></span>
    </a>
  </div>
</header>
