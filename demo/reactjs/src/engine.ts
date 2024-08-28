import { Liquid } from 'liquidjs';

export const engine = new Liquid({
    root: 'views/',
    extname: '.liquid'     // the extname used for layouts/includes, defaults 
});

engine.registerFilter('image', d => {
  let img = `<img src="${d}" class="App-logo" alt="logo"></img>`;  
  return img 
})
