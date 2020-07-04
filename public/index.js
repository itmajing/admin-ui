;(function() {
  // determine browser is chromium
  const agent = window.navigator.userAgent
  const isChromium = agent.indexOf('Chrome') > -1
  if (!isChromium) {
    window.location.href = 'browser/index.html'
  }

  // calculate the file loading progress
  // TODO
})()
