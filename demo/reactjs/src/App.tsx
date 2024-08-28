import { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import demo from './views/demo.liquid?raw';
import { engine } from './engine';

const template = engine.parse(demo)

export class App extends Component {
  state = { html: '' }

  async componentDidMount() {
    const html = await engine.render(template, {name: 'liquid', logo })
    this.setState({ html })
  }

  render() { 
    return (
      <div className="App" dangerouslySetInnerHTML={{__html: this.state.html}}>
      </div>
    )
  }
}
