'use strict'
const express = require('express')
const https = require('https')
const pem = require('pem')
const host = 'localhost'
const port = 8080

pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
  if(err){
    throw err
  }
  let app = express()
  app.use(express.static('./'))
    var options = {
    key: keys.serviceKey,
    cert: keys.certificate
  }
  let server = https.createServer(options, app)
  server.listen(port, host)
  console.log('Secure connection on %s:%s', host, port)
})

