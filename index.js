/*
* 1. establish repo
* 2. put html in that repo
* 3. pull html out of repo
* 4. setup service worker to serve html
* 5. render html
* */
const isBrowser = !!global.window
console.log('Code started')
//const IPFS = require('D:/Workspace/src/github.com/vijayee/js-ipfs/src/core/index.js')
//const IPFSRepo = require('ipfs-repo')
//const base58 = require('bs58')

const async = require('async')
const _ = require('lodash')

if (isBrowser) {
  /* Configure Repo In the browser*/
  var repoData = []
  const store = require('idb-plus-blob-store')
  const mainBlob = store('ipfs')
  const blocksBlob = store('ipfs/blocks')
  const repoContext = require.context('buffer!./.ipfs', true)
  repoContext.keys().forEach(function (key) {
    console.log('stuffing into idb: ' + key)
    repoData.push({
      key: key.replace('./', ''),
      value: repoContext(key)
    })
  })
  /* Insert Repo Data into IDB*/
  async.eachSeries(repoData, (file, cb) => {
    if (_.startsWith(file.key, 'datastore/')) {
      return cb()
    }

    const blocks = _.startsWith(file.key, 'blocks/')
    const blob = blocks ? blocksBlob : mainBlob

    const key = blocks ? file.key.replace(/^blocks\//, '') : file.key

    blob.createWriteStream({
      key: key
    }).end(file.value, cb)
    /* Establish Service Worker*/
  }, () => {
    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register('ipfs-service-worker.js', {scope: './'})
    }
  })
}
/*
else {
  const fs = require('fs-blob-store')
  var repo = new IPFSRepo('./.ipfs', {
    stores: fs
  })

  var node = new IPFS(repo)
  console.log('Node Created')
  console.log('Adding Files')
  node.files.add('./html5up-prologue', {
    recursive: true
  }, function (err, rootStat) {
    if (err) { throw err }
    console.log('HASH: ' + base58.encode(rootStat.Hash))
  })
}*/
/*
* HASH: QmcTopr4M1aYDAu7WbbBfNVWx1sRBnd6cPBSHjBbqXAovm
* */
/*
node.load(function(err){
    if(err){
        console.error(err)
    }
    console.log('Node loaded')
})
node.id(function(err, info){
    if(err){
        console.error(err)
    }
    console.log('Node ID' + info.ID)
})
*/