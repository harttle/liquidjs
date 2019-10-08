import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import tpl from './views/demo.liquid';
import Parser from 'html-react-parser';
import { engine } from './engine';

export class App extends Component {
  async componentDidMount() {
    const html = await engine.renderFile(tpl.toString(), {name: 'alice', logo: logo })
    this.setState({ html })  // outputs "Alice"
  }

  state = { html: '' }

  render() { 
    return (
      <div className="App">
        {Parser(`${this.state.html}`)}
      </div>
    );
  }
}
