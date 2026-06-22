<header id="banner" class="wrapper">
  <div class="inner inner-content">
    <h2 id="banner-title">{{ page.subtitle }}</h2>
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
{{ partial('partial/home-section', {
  wrapId: 'used-by',
  variant: 'logos',
  title: __('index.used_by.title'),
  description: __('index.used_by.description'),
  contentPartial: 'used-by'
}) }}
{{ partial('partial/home-section', {
  wrapId: 'sponsors',
  variant: 'logos',
  title: __('index.sponsors.title'),
  description: __('index.sponsors.description'),
  contentPartial: 'financial-contributors'
}) }}
{{ partial('partial/home-section', {
  wrapId: 'contributors',
  variant: 'people',
  title: __('index.contributors.title'),
  description: __('index.contributors.description'),
  contentPartial: 'all-contributors'
}) }}
