const { readdirSync } = require('fs')
const { resolve: resolvePath } = require('path')
const express = require('express')
const router = express.Router()
const routeFactory = require('../../lib/route-factory')

const files = readdirSync(resolvePath(__dirname, './'))
const currentFile = __filename.slice(__dirname.length + 1)

files.forEach(function (file) {
  if (file !== currentFile) {
    const modelName = file.slice(0, -3)
    const route = routeFactory(require('./' + modelName))
    router.use('/' + modelName, route)
  }
})

module.exports = router
