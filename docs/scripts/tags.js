/* global hexo */

'use strict';

hexo.extend.tag.register('note', (args, content) => {
  const className = args.shift();
  let header = '';
  let result = '';

  if (args.length) {
    header += `<strong class="note-title">${args.join(' ')}</strong>`;
  }

  result += `<blockquote class="note ${className}">${header}`;
  result += hexo.render.renderSync({text: content, engine: 'markdown'});
  result += '</blockquote>';

  return result;
}, true);
