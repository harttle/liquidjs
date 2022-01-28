<div id="playground" role="main">
  <div class="wrapper">
    <h1 class="inner">{{__('playground.title')}}</h1>
    <div class="loader" role=status aria-busy=true></div>
    <div id="editors" class="row inner hide" aria-hide=true>
      <div class="col">
        <div id="editorEl">{{ raw('partial/demo.liquid') }}</div>
        <div id="dataEl">{}</div>
      </div>
      <div class="col" id="previewEl">{{__('playground.loading')}}</div>
    </div>
    <p class="inner version"></p>
  </div>
</div>
