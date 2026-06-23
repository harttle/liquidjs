<div id="playground" role="main">
  <div class="wrapper">
    <header class="playground-hero inner">
      <div class="playground-hero-text">
        <h1>{{__('playground.title')}}</h1>
        <p class="playground-lead">{{__('playground.lead')}}</p>
      </div>
      <p class="playground-version version"></p>
    </header>
    <div class="loader" role=status aria-busy=true></div>
    <div id="editors" class="inner hide" aria-hide=true>
      <div class="playground-workspace">
        <div class="playground-pane area-tpl">
          <div class="pane-head">
            <span class="pane-indicator" data-state="idle" aria-hidden="true"></span>
            <h2>Template</h2>
          </div>
          <div class="pane-body">
            <div class="editor" id="editorEl">{{ raw('partial/demo.liquid') }}</div>
          </div>
        </div>
        <div class="playground-pane area-data">
          <div class="pane-head">
            <span class="pane-indicator" data-state="idle" aria-hidden="true"></span>
            <h2>Context</h2>
          </div>
          <div class="pane-body">
            <div class="editor" id="dataEl">{{ raw('partial/demo.json') }}</div>
          </div>
        </div>
        <div class="playground-pane area-output">
          <div class="pane-head">
            <span class="pane-indicator" data-state="idle" aria-hidden="true"></span>
            <h2>Output</h2>
          </div>
          <div class="pane-body">
            <div class="editor output-editor" id="previewEl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
