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
      <div id="intro-cmd-wrap" class="highlight typescript"><pre><span class="line"><span class="keyword">import</span> { Liquid } <span class="keyword">from</span> <span class="string">'liquidjs'</span></span><br><span class="line"><span class="keyword">const</span> engine = <span class="keyword">new</span> Liquid()</span><br><span class="line"><span class="keyword">const</span> tpl = engine.parse(<span class="string">'Welcome to {{v}}!'</span>)</span><br><span class="line">engine.render(tpl, {<span class="attr">v</span>: <span class="string">"Liquid"</span>}).then(<span class="built_in">console</span>.log)</span><br><span class="line"><span class="comment">// Outputs "Welcome to Liquid!"</span></span><br></pre></div>
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
