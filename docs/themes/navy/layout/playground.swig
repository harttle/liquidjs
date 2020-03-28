<div id="playground" role="main">
  <div class="wrapper">
    <h1 class="inner">{{__('playground.title')}}</h1>
    <div class="row inner">
      <div id="editorEl">{{__('playground.loading')}}</div>
      <div id="previewEl">{{__('playground.loading')}}</div>
    </div>
    <script id="sourceEl" type="text/plain">{{ raw('partial/demo.liquid') }}</script>
  </div>
</div>
