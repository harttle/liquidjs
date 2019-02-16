import * as chai from 'chai'
import Liquid from '../..'
import * as chaiAsPromised from 'chai-as-promised'

const liquid = new Liquid()
const expect = chai.expect
chai.use(chaiAsPromised)

const cases = [
  {
    text: `
      <div>
        <p>
          {{ 'John' }}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          John
        </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>


          {{- 'John' -}}


        </p>
      </div>
    `,
    expected: `
      <div>
        <p>John</p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>


          {%- if true -%}
          yes
          {%- endif -%}


        </p>
      </div>
    `,
    expected: `
      <div>
        <p>yes</p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {% if true %}
          yes
          {% endif %}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          
          yes
          
        </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {% if false %}
          no
          {% endif %}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          
        </p>
      </div>
    `
  }, {
    text: '<p>{{- \'John\' -}}</p>',
    expected: '<p>John</p>'
  }, {
    text: '<p>{%- if true -%}yes{%- endif -%}</p>',
    expected: '<p>yes</p>'
  }, {
    text: '<p>{%- if false -%}no{%- endif -%}</p>',
    expected: '<p></p>'
  }, {
    text: '<p> {%- if true %} yes {% endif -%} </p>',
    expected: '<p> yes </p>'
  }, {
    text: '<p> {%- if false %} no {% endif -%} </p>',
    expected: '<p></p>'
  }, {
    text: '<p> {% if true -%} yes {%- endif %} </p>',
    expected: '<p> yes </p>'
  }, {
    text: '<p> {% if false -%} no {%- endif %} </p>',
    expected: '<p>  </p>'
  }, {
    text: '<p> {% if true -%} yes {% endif -%} </p>',
    expected: '<p> yes </p>'
  }, {
    text: '<p> {% if false -%} no {% endif -%} </p>',
    expected: '<p> </p>'
  }, {
    text: '<p> {%- if true %} yes {%- endif %} </p>',
    expected: '<p> yes </p>'
  }, {
    text: '<p> {%- if false %} no {%- endif %} </p>',
    expected: '<p> </p>'
  }, {
    text: `
      <div>
        <p>
          {{- 'John' }}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>John
        </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if true %}
          yes
          {%- endif %}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          yes
        </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if false %}
          no
          {%- endif %}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
        </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {{ 'John' -}}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          John</p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {% if true -%}
          yes
          {% endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          yes
          </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {% if false -%}
          no
          {% endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if true %}
          yes
          {% endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          yes
          </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if false %}
          no
          {% endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p></p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {% if true -%}
          yes
          {%- endif %}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          yes
        </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {% if false -%}
          no
          {%- endif %}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>
          
        </p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {{- 'John' -}}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>John</p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if true -%}
          yes
          {%- endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>yes</p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if false -%}
          no
          {%- endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p></p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {{- 'John' -}},
          {{- '30' -}}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>John,30</p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if true -%}
          yes
          {%- endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p>yes</p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {%- if false -%}
          no
          {%- endif -%}
        </p>
      </div>
    `,
    expected: `
      <div>
        <p></p>
      </div>
    `
  }, {
    text: `
      <div>
        <p>
          {{- 'John' -}}
          {{- '30' -}}
        </p>
        <b>
          {{ 'John' -}}
          {{- '30' }}
        </b>
        <i>
          {{- 'John' }}
          {{ '30' -}}
        </i>
      </div>
    `,
    expected: `
      <div>
        <p>John30</p>
        <b>
          John30
        </b>
        <i>John
          30</i>
      </div>
    `
  }, {
    text: `
      <div>
        {%- if true -%}
          {%- if true -%}
            <p>
              {{- 'John' -}}
            </p>
          {%- endif -%}
        {%- endif -%}
      </div>
    `,
    expected: `
      <div><p>John</p></div>
    `
  }, {
    text: `
      <div>
        {% raw %}
          {%- if true -%}
            <p>
              {{- 'John' -}}
            </p>
          {%- endif -%}
        {% endraw %}
      </div>
    `,
    expected: `
      <div>
        
          {%- if true -%}
            <p>
              {{- 'John' -}}
            </p>
          {%- endif -%}
        
      </div>
    `
  }
]

describe('Whitespace Control', function () {
  cases.forEach(item => it(
    item.text,
    () => expect(liquid.parseAndRender(item.text)).to.eventually.equal(item.expected)
  ))
})
