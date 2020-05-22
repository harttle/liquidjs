<head prefix="og: http://ogp.me/ns#">
  <meta charset="utf-8">
  <title>{% if page.title %}{{ page.title }} | {% endif %}{{ config.title }}</title>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net/">
  <link rel="manifest" href="/manifest.json">
  <!-- Canonical links -->
  <link rel="canonical" href="{{ url }}">
  <!-- Alternative links -->
  {% if page.layout == 'page' or page.layout == 'index' %}
    {% for lang in site.data.languages %}
      <link rel="alternative" hreflang="{{ loop.key }}" href="{{ canonical_url(loop.key) }}">
    {% endfor %}
  {% endif %}
  <!-- Icon -->
  <link rel="apple-touch-icon" sizes="57x57" href="{{ url_for('icon/apple-touch-icon-57x57.png') }}">
  <link rel="apple-touch-icon" sizes="114x114" href="{{ url_for('icon/apple-touch-icon-114x114.png') }}">
  <link rel="apple-touch-icon" sizes="72x72" href="{{ url_for('icon/apple-touch-icon-72x72.png') }}">
  <link rel="apple-touch-icon" sizes="144x144" href="{{ url_for('icon/apple-touch-icon-144x144.png') }}">
  <link rel="apple-touch-icon" sizes="60x60" href="{{ url_for('icon/apple-touch-icon-60x60.png') }}">
  <link rel="apple-touch-icon" sizes="120x120" href="{{ url_for('icon/apple-touch-icon-120x120.png') }}">
  <link rel="apple-touch-icon" sizes="76x76" href="{{ url_for('icon/apple-touch-icon-76x76.png') }}">
  <link rel="apple-touch-icon" sizes="152x152" href="{{ url_for('icon/apple-touch-icon-152x152.png') }}">
  <link rel="icon" type="image/png" href="{{ url_for('icon/favicon-196x196.png') }}" sizes="196x196">
  <link rel="icon" type="image/png" href="{{ url_for('icon/favicon-160x160.png') }}" sizes="160x160">
  <link rel="icon" type="image/png" href="{{ url_for('icon/favicon-96x96.png') }}" sizes="96x96">
  <link rel="icon" type="image/png" href="{{ url_for('icon/favicon-16x16.png') }}" sizes="16x16">
  <link rel="icon" type="image/png" href="{{ url_for('icon/favicon-32x32.png') }}" sizes="32x32">
  <meta name="msapplication-TileColor" content="#2f83cd">
  <meta name="msapplication-TileImage" content="{{ url_for('icon/mstile-144x144.png') }}">
  {{ css('css/navy') }}
  {{ feed_tag('atom.xml') }}
</head>
