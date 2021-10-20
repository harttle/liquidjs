<div id="playground" role="main">
  <div class="wrapper">
    <h1 class="inner">{{__('playground.title')}}</h1>
    <div class="row inner">
      <div class="col">
        <div id="editorEl">{{ raw('partial/demo.liquid') }}</div>
        <div id="dataEl">{}</div>
      </div>
      <div class="col" id="previewEl">{{__('playground.loading')}}</div>
    </div>
    <p class="inner version"></p>
  </div>
</div>
