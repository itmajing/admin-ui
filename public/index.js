/* eslint-disable prefer-const */
;(function() {
  if (window) {
    let userAgent = window.navigator.userAgent
    window.console.log(userAgent)

    // determine platform is pc
    let mobileAgents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    for (let i = 0; i < mobileAgents.length; i++) {
      if (userAgent.indexOf(mobileAgents[i]) > -1) {
        window.location.href = '/platform'
        break
      }
    }

    // determine browser is chromium
    const isChromium = userAgent.indexOf('Chrome') > -1
    if (!isChromium) {
      window.location.href = '/browser'
    }

    // calculate the file loading progress
    // TODO
  }
})()
/* eslint-disable prefer-const */
