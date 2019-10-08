/*
 * function Component with Hooks: Modify ./index.js to apply this file
 */
import React, { useState, useLayoutEffect } from 'react';
import './App.css';
import logo from './logo.svg';
import tplsrc from './views/showing-click-times.liquid';
import Parser from 'html-react-parser';
import { engine } from './engine';
import { Context } from './Context';
import { ClickButton } from './ClickButton';

const fetchTpl = engine.getTemplate(tplsrc.toString())

export function App() {
  const [state, setState] = useState({
    logo: logo,
    name: 'alice',
    clickCount: 0,
    html: ''
  });

  useLayoutEffect(() => {
    fetchTpl
      .then(tpl => engine.render(tpl, state))
      .then(html => setState({...state, html}))
  }, [state.clickCount])

  return (
    <div className="App">
      {Parser(`${state.html}`)}
      <Context.Provider
        value={{
          count: () => setState({...state, clickCount: state.clickCount + 1})
        }}
      >
        <ClickButton/>
      </Context.Provider>
    </div>
  );
}
