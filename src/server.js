const cors = require('cors')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const config = require('./config/config')
const mongoose = require('mongoose')

// Initiate connection and bind to glocal promise
mongoose.promise = global.Promise
console.log(config.dbUrl)
mongoose.connect(config.dbUrl, { useNewUrlParser: true })
mongoose.set('debug', true)

// Initialize passport configuration
require('./config/passport')

const isProduction = process.env.NODE_ENV === 'production'

const app = require('express')()

app.use(cors())
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('./routes/index'))

if (!isProduction) {
  app.use(errorHandler())
}

app.listen(config.apiPort, () => console.log('Server is listening on http://localhost:3000'))
