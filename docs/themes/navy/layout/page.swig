<div id="content-wrap">
  <div id="content" class="wrapper">
    <div id="content-inner">
      {{ partial('partial/sidebar') }}
      <article class="article-container" itemscope itemtype="http://schema.org/Article">
        <div class="article-inner">
          <div class="article">
            <div class="inner">
              <header class="article-header">
                <h1 class="article-title" itemprop="name">{{ page.title }}</h1>
                {% if page.auto %}
                <a href="https://github.com/harttle/liquidjs/issues/new?title=docs:&body={{"URL: " + url | url_encode}}&labels=docs" class="article-edit-link" title="{{ __('page.report') }}"><i class="icon-chat-bubble-dots"></i></a>
                {% else %}
                <a href="{{ raw_link(page.source) }}" class="article-edit-link" title="{{ __('page.improve') }}"><i class="icon-pencil"></i></a>
                {% endif %}
              </header>
              <div class="article-content" itemprop="articleBody">
                {{ page_anchor(page.content) }}
              </div>
              <footer class="article-footer">
                <time class="article-footer-updated" datetime="{{ date_xml(page.updated) }}" itemprop="dateModified">{{ __('page.last_updated', date(page.updated)) }}</time>
                {{ page_nav() }}
              </footer>
            </div>
          </div>
          <aside id="article-toc" role="navigation">
            <div id="article-toc-inner">
              <div id="article-toc-inner-list">
                <strong class="sidebar-title">{{ __('page.contents') }}</strong>
                {{ toc(page.content, {list_number: false}) }}
              </div>
              <a href="#" id="article-toc-top">{{ __('page.back_to_top') }}</a>
            </div>
          </aside>
        </div>
      </article>
    </div>
  </div>
</div>
