<div id="playground" role="main">
  <div class="wrapper">
    <h1 class="inner">{{__('playground.title')}}</h1>
    <div class="loader" role=status aria-busy=true></div>
    <div id="editors" class="inner hide" aria-hide=true>
      <div class="area-tpl editor-wrapper">
        <div class="pane-window">
          <span class="pane-tab">Template</span>
          <div class="editor" id="editorEl">{{ raw('partial/demo.liquid') }}</div>
        </div>
      </div>
      <div class="area-data editor-wrapper">
        <div class="pane-window">
          <span class="pane-tab">Context</span>
          <div class="editor" id="dataEl">{{ raw('partial/demo.json') }}</div>
        </div>
      </div>
      <div class="area-output editor-wrapper">
        <div class="pane-window">
          <span class="pane-tab">Output</span>
          <div class="output-preview" id="previewEl">
            <pre class="highlight"><code class="language-markup" id="previewCode">{{__('playground.loading')}}</code></pre>
          </div>
        </div>
      </div>
    </div>
    <p class="inner version"></p>
  </div>
</div>
