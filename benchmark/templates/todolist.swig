<section class="todo-list">
    <h1>
        posuere cubilia Curae; Vestibulum hendrerit malesuada odio. Fusce ut elit
        ut augue sollicitudin blandit. Phasellus volutpat lorem. Duis non pede et
        neque luctus tincidunt. Duis interdum tempus elit.
        <small>Aenean metus. Vestibulum ac lacus. Vivamus porttitor, massa ut.</small>
    </h1>
    <a href={{"/add" | url}} class="todo-add"><i class="fa fa-plus-square"></i>Add Todo</a>
    <ul class="filter-category">
        {% for item in categories %}
        <li style="background: {{ item.color }}">
            <a href="/todos/category/{{ item.id }}">{{ item.title }}</a>
        </li>
        {% endfor %}
    </ul>
    {% for todo in todos %}
    <div>
        <h2>
            Todo {{ loop.index }}:
            <span class="todo-item content" data-todo-index="{{ loop.index0 }}">
                {{ todo.title | prepend('TODO: ') | upcase }}
            </span>
        </h2>
        {% include "todo-icon.swig" %}

        <p class="description">
            Purus eu mi. Proin commodo, massa commodo dapibus elementum,
            libero lacus pulvinar eros, ut tincidunt nisl elit ut velit. Cras rutrum
            porta purus. Vivamus lorem. Sed turpis enim, faucibus quis, pharetra in,
            sagittis sed, magna. Curabitur ultricies felis ut libero. Nullam tincidunt
            enim eu nibh. Nunc eget ipsum in sem facilisis convallis. Proin fermentum
        </p>

        <div class="todo-meta">
            {% if todo.category %}
                <span>{{ todo.category | capitalize }}</span>
            {% endif %}
        </div>
        <a class="btn btn-primary" href={{"/edit/" | append(todo.id) | url }}><i class="fa fa-pencil"></i> Edit</a>
        <a class="btn btn-default"><i class="fa fa-check"></i> Check</a>
        <a class="btn ben-danger" href={{"/delete/" | append(todo.id) | url }}><i class="fa fa-trash-o"</i> Trash</a>
    </div>
    {% endfor %}
</section>
