import { useState, useLayoutEffect } from 'react';
import './App.css';
import logo from './logo.svg';
import showingClickTimes from './views/showing-click-times.liquid?raw';
import { engine } from './engine';
import { Context } from './Context';
import { ClickButton } from './ClickButton';

const tpl = engine.parse(showingClickTimes)

export function App() {
  const [state, setState] = useState({
    logo,
    name: 'liquid',
    clickCount: 0,
    html: ''
  });

  useLayoutEffect(() => {
    engine.render(tpl, state).then(html => setState({...state, html}))
  }, [state.clickCount])

  return (
    <div className="App">
      <div dangerouslySetInnerHTML={{__html: state.html}}></div>
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
