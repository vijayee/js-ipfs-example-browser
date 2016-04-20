self.oninstall = (event) => {
  event.waitUntil(self.skipWaiting())
}

self.onactivate = (event) => {
  event.waitUntil(self.clients.claim())
}
importScripts('./lib/ServiceWorkerWare.js')
var root = (() => {
  var tokens = (self.location + '').split('/')
  tokens[ tokens.length - 1 ] = ''
  return tokens.join('/')
})()

var worker = new ServiceWorkerWare()
worker.get(root, (req, res) => {
  let content = '<html><body><br />' +
    'Welcome to IPFS <br /> Enter a hash into the address bar ' +
    '<br /> ie: ' + root + 'ipfs/QmcTopr4M1aYDAu7WbbBfNVWx1sRBnd6cPBSHjBbqXAovm' +
    '</body></html>'
  return Promise.resolve(new Response(content, {
    headers: {
      'Content-Type': 'text/html'
    }
  }))
})
worker.get(root + 'ipfs/', (req, res) => {
  let url = req.clone().url
  let hash = req.parameters.hash
  let resource = req.parameters.resource
  let content = '<html><body><br />' +
    'Please enter a valid hash</body></html>'
  console.log('IPFS GET: ' + url)
  return Promise.resolve(new Response(content, {
    headers: {
      'Content-Type': 'text/html'
    }
  }))
})
worker.get(root + 'ipfs/:hash', (req, res) => {
  let url = req.clone().url
  let hash = req.parameters.hash
  let content = '<html><body><br />' +
    'Request for: <br />' + url +
    '<br/>will work one day</body></html>'
  console.log('IPFS GET: ' + url)
  return Promise.resolve(new Response(content, {
    headers: {
      'Content-Type': 'text/html'
    }
  }))
})
worker.get(root + 'ipfs/:hash/*', (req, res) => {
  let url = req.clone().url
  let hash = req.parameters.hash
  let resource = url.substring(url.indexOf(hash) + hash.lenth, url.length)
  let content = '<html><body><br />' +
    'Request for: <br />' + url +
    '<br/>will work one day</body></html>'
  console.log('IPFS GET: ' + url)
  return Promise.resolve(new Response(content, {
    headers: {
      'Content-Type': 'text/html'
    }
  }))
})

worker.init()