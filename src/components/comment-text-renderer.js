import markdownIt from 'markdown-it';
import highlightJs from './highlightJs.js';

var markdownRender = markdownIt({
  typographer: false,
  linkify: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && highlightJs.getLanguage(lang)) {
      try {
        return `<pre class="hljs highlight ${lang}"><code>${highlightJs.highlight(lang, str, true).value}</code></pre>`;
      } catch (_) {}
    }

    return '<pre class="highlight"><code>' + markdownRender.utils.escapeHtml(str) + '</code></pre>';
  }
});
// Remember old renderer, if overriden, or proxy to default renderer
let defaultLinkRender = markdownRender.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

markdownRender.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  var aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultLinkRender(tokens, idx, options, env, self);
};

let imgRender = markdownRender.renderer.rules.image;

markdownRender.renderer.rules.image = function (tokens, idx, options, env, self) {
  let isInLink = [];
  for (let i = 0; i < idx; i++) { // idx 为当前节点的顺序
    if (!tokens[i])
      continue;
    if (tokens[i].type == 'link_open') {
      isInLink.push(true);
    }
    if (tokens[i].type == 'link_close') {
      isInLink.pop();
    }
  }

  if (isInLink.length > 0) {
    return imgRender(tokens, idx, options, env, self);
  }

  let token = tokens[idx],
      aIndex = token.attrIndex('src');

  return `<a href="${token.attrs[aIndex][1]}" target="_blank">${imgRender(tokens, idx, options, env, self)}</a>`;
};

export default markdownRender;