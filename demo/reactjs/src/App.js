import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let path   = require('path')
let Liquid = require('liquidjs'); 

let config = require('./views/demo.liquid');
let pageConfig = config.toString()

let Parser = require('html-react-parser');

class App extends Component {

componentDidMount() {

  let engine = Liquid({
      root: path.resolve(__dirname, 'views/'),  // dirs to lookup layouts/includes
      extname: '.liquid'     // the extname used for layouts/includes, defaults 
  });

  engine.registerFilter('image', d => {
    let img = `<img src="${d}" class="App-logo" alt="logo"></img>`;  
    return img 
  })
    
  engine.renderFile(pageConfig, {name: 'alice', logo: logo })
    .then((htmlTemp) => {
      this.setState({ html: htmlTemp })
    })  // outputs "Alice"
}

state = { 
  html: []
}

  render() { 
    return (
      <div className="App">
        {Parser(`${this.state.html}`)}
      </div>
    );
  }
}

export default App;
