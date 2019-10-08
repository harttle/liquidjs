import './ClickButton.css';
import React from 'react';
import { Context } from './Context';

export function ClickButton() {
  return (
    <Context.Consumer>
      {context => (
        <button onClick={context.count}>
          Click Here!
        </button>
      )}
    </Context.Consumer>
  );
};
