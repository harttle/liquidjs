// eslint-disable-next-line
const React = require('react')

function capitalize (str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
function url (path) {
  return `http://example.com${path}`
}
function renderTodoIcon (id) {
  return <img title="risus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices" src="http://images.example.com/{id}.png"/>
}

module.exports = ({ categories, todos }) => {
  return <section className="todo-list">
    <h1>
            posuere cubilia Curae; Vestibulum hendrerit malesuada odio. Fusce ut elit
            ut augue sollicitudin blandit. Phasellus volutpat lorem. Duis non pede et
            neque luctus tincidunt. Duis interdum tempus elit.
      <small>Aenean metus. Vestibulum ac lacus. Vivamus porttitor, massa ut.</small>
    </h1>
    <a href={url('/add')} className="todo-add"><i className="fa fa-plus-square"></i>Add Todo</a>
    <ul className="filter-category">
      {categories.map((item, i) => {
        return <li key={i} style={{ background: item.color }}>
          <a href={'/todos/category/' + item.id }>{ item.title }</a>
        </li>
      })}
    </ul>
    {todos.map((todo, index0) => {
      return <div key={index0}>
        <h2>
                    Todo { index0 + 1 }:
          <span className="todo-item content" data-todo-index="{{ forloop.index0 }}">
            { ('TODO: ' + todo.title).toUpperCase() }
          </span>
        </h2>
        { renderTodoIcon(todo.id) }

        <p className="description">
                    Purus eu mi. Proin commodo, massa commodo dapibus elementum,
                    libero lacus pulvinar eros, ut tincidunt nisl elit ut velit. Cras rutrum
                    porta purus. Vivamus lorem. Sed turpis enim, faucibus quis, pharetra in,
                    sagittis sed, magna. Curabitur ultricies felis ut libero. Nullam tincidunt
                    enim eu nibh. Nunc eget ipsum in sem facilisis convallis. Proin fermentum
        </p>

        <div className="todo-meta">
          { todo.category ? <span>{capitalize(todo.category)}</span> : '' }
        </div>
        <a className="btn btn-primary" href={url('/edit/' + todo.id)}><i className="fa fa-pencil"></i> Edit</a>
        <a className="btn btn-default"><i className="fa fa-check"></i> Check</a>
        <a className="btn ben-danger" href={url('/delete/' + todo.id)}><i className="fa fa-trash-o"></i> Trash</a>
      </div>
    })}
  </section>
}
