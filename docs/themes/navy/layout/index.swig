<header id="banner" class="wrapper">
  <div class="inner">
    <h2 id="banner-title">{{ page.subtitle }}</h2>
    <div id="banner-start">
      <code id="banner-start-command">npm install liquidjs</code><a id="banner-start-link" href="./tutorials/setup.html"><i class="icon-arrow-right"></i></a>
    </div>
    <div id="banner-share">{{ partial('partial/share') }}</div>
  </div>
</header>
<div id="intro-news-list">
  <div class="wrapper">
    <div class="inner">
      <div id="intro-news-flex">
        {% for news in site.data.news %}
        <a href="{{news.url}}" class="intro-news-wrap">
          <div class="intro-news-time">{{news.date}}</div>
          <div class="intro-news-title">{{news.title[page.lang]}}</div>
        </a>
        {% endfor %}
      </div>
    </div>
  </div>
</div>
<div id="content-wrap">
  <div class="wrapper">
    <div class="inner">
      {{ page.content }}
      <ul id="intro-cmd-wrap">
        <li class="intro-code-item"><span class="hl">import</span> { Liquid } <span class="hl">from</span> 'liquidjs'</li>
        <li class="intro-code-item"><span class="hl">const</span> engine = <span class="hl">new</span> Liquid()</li>
        <li class="intro-code-item"><span class="hl">const</span> tpl = engine.parse(<span class="hl-str">'Welcome to &#x7b;&#x7b;v}}!'</span>)</li>
        <li class="intro-code-item">engine.render(tpl, {v: "Liquid"}).then(console.log)</li>
        <li class="intro-code-item"><span class="hl-comment">// Outputs "Welcome to Liquid!"</span></li>
      </ul>
      <div id="intro-get-started-wrap">
        <a href="tutorials/setup.html" id="intro-get-started-link">{{ __('index.get_started') }}</a>
      </div>
    </div>
  </div>
</div>
<div id="contributors-wrap">
  <div class="wrapper">
    <div class="inner">
      <h3>{{__('index.contributors.title')}}</h3>
      <p class="description">{{__('index.contributors.description')}}</p>
      <div class="all-contributors">
        {{ partial('partial/all-contributors') }}
      </div>
    </div>
  </div>
</div>
<div id="sponsors-wrap">
  <div class="wrapper">
    <div class="inner">
      <h3>{{__('index.sponsors.title')}}</h3>
      <p class="description">{{__('index.sponsors.description')}}</p>
      <div class="open-collective">
        <object type="image/svg+xml" data="https://opencollective.com/liquidjs/tiers/backer.svg?avatarHeight=72"></object>
      </div>
    </div>
  </div>
</div>
