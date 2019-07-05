const { readdirSync } = require('fs')
const { resolve: resolvePath } = require('path')
const { pascalCase } = require('change-case')

const models = {}
const files = readdirSync(resolvePath(__dirname, './'))
const currentFile = __filename.slice(__dirname.length + 1)

function factory () {
  console.log('factory')
  files.forEach(function (file) {
    if (file !== currentFile) {
      const modelName = file.slice(0, -3)
      models[pascalCase(modelName)] = require('./' + modelName)
    }
  })
  return models
}

if (!factory.models) {
  factory.models = factory()
}

module.exports = factory.models
