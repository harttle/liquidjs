<footer id="footer" class="wrapper">
  <div class="inner">
    <div id="footer-copyright">
      &copy; {{ moment(Date.now()).year() }} <a href="https://github.com/harttle/liquidjs/graphs/contributors" target="_blank">{{ config.author }}</a><br>
      {{__('footer.license')}}
    </div>
    <div id="footer-links">
      <a href="https://twitter.com/{{ config.twitter }}" class="footer-link" target="_blank"><i class="icon-twitter"></i></a>
      <a href="https://www.patreon.com/{{ config.patreon }}" class="footer-link" target="_blank"><i class="icon-patreon"></i></a>
      <a href="https://opencollective.com/{{ config.oc }}" class="footer-link" target="_blank"><i class="icon-opencollective"></i></a>
      <a href="https://github.com/{{ config.github }}" class="footer-link" target="_blank"><i class="icon-github"></i></a>
    </div>
  </div>
</footer>
