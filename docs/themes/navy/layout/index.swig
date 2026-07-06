<header id="banner" class="wrapper">
  <div class="inner inner-content">
    <h2 id="banner-title">{{ page.subtitle | default(config.subtitle) }}</h2>
    <div id="banner-share">{{ partial('partial/share') }}</div>
    <div id="banner-start">
      <code id="banner-start-command">npm install liquidjs</code><a id="banner-start-link" href="./tutorials/setup.html"><i class="icon-arrow-right"></i></a>
    </div>
  </div>
</header>
<div id="content-wrap">
  <div class="wrapper">
    <div class="inner inner-content">
      {{ page.content }}
    </div>
  </div>
</div>
<div id="used-by-wrap">
  <div class="wrapper">
    <div class="inner inner-content">
      <div class="section-header">
        <h3>{{__('index.used_by.title')}}</h3>
        <p class="description">{{__('index.used_by.description')}}</p>
      </div>
      <div class="contributors">
        {{ partial('partial/used-by') }}
      </div>
    </div>
  </div>
</div>
<div id="sponsors-wrap">
  <div class="wrapper">
    <div class="inner inner-content">
      <div class="section-header">
        <h3>{{__('index.sponsors.title')}}</h3>
        <p class="description">{{__('index.sponsors.description')}}</p>
      </div>
      <div class="contributors">
        {{ partial('partial/financial-contributors') }}
      </div>
    </div>
  </div>
</div>
<div id="contributors-wrap">
  <div class="wrapper">
    <div class="inner inner-content">
      <div class="section-header">
        <h3>{{__('index.contributors.title')}}</h3>
        <p class="description">{{__('index.contributors.description')}}</p>
      </div>
      <div class="contributors">
        {{ partial('partial/all-contributors') }}
      </div>
    </div>
  </div>
</div>
