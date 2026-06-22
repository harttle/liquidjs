<div id="{{ wrapId }}-wrap" class="home-section home-section--{{ variant }}">
  <div class="wrapper">
    <div class="inner inner-content">
      <div class="section-header">
        <h3>{{ title }}</h3>
        <p class="description">{{ description | safe }}</p>
      </div>
      <div class="contributors">
        {% if contentPartial == 'used-by' %}
          {{ partial('partial/used-by') }}
        {% elif contentPartial == 'financial-contributors' %}
          {{ partial('partial/financial-contributors') }}
        {% else %}
          {{ partial('partial/all-contributors') }}
        {% endif %}
      </div>
    </div>
  </div>
</div>
