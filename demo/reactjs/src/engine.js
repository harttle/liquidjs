import path from 'path';
import { Liquid } from 'liquidjs';

export const engine = new Liquid({
    root: path.resolve(__dirname, 'views/'),  // dirs to lookup layouts/includes
    extname: '.liquid'     // the extname used for layouts/includes, defaults 
});

engine.registerFilter('image', d => {
  let img = `<img src="${d}" class="App-logo" alt="logo"></img>`;  
  return img 
})
