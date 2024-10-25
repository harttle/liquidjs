<div id="playground" role="main">
  <div class="wrapper">
    <h1 class="inner">{{__('playground.title')}}</h1>
    <div class="loader" role=status aria-busy=true></div>
    <div id="editors" class="inner hide" aria-hide=true>
      <div class="area-tpl editor-wrapper">
        <h2>Template</h2>
        <div class="editor" id="editorEl">{{ raw('partial/demo.liquid') }}</div>
      </div>
      <div class="area-data editor-wrapper">
        <h2>Context</h2>
        <div class="editor" id="dataEl">{{ raw('partial/demo.json') }}</div>
      </div>
      <div class="area-output editor-wrapper">
        <h2>Output</h2>
        <div class="editor" id="previewEl">{{__('playground.loading')}}</div>
      </div>
    </div>
    <p class="inner version"></p>
  </div>
</div>
