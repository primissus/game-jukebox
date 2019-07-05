const express = require('express')
const auth = require('../routes/auth')

module.exports = function (routeConfig) {
  const Model = routeConfig.Model
  const router = express.Router()

  const routes = [
    {
      method: 'get',
      path: '/',
      fn: findAll
    },
    {
      method: 'post',
      path: '/',
      fn: create
    },
    {
      method: 'patch',
      path: '/',
      fn: updateAttributes
    },
    {
      method: 'get',
      path: '/:id',
      fn: findById
    }
  ]

  if (routeConfig.beforeInit) {
    routeConfig.beforeInit(router)
  }

  routes.forEach(route => {
    if (!(
      routeConfig.exclude &&
      routeConfig.exclude.some(e =>
        e.method === route.method && e.path === route.path
      )
    )) {
      router[route.method](route.path, auth.required, route.fn)
    }
  })
  // router.get('/', auth.required, findAll)
  // router.post('/', auth.required, create)
  // router.patch('/', auth.required, updateAttributes)
  // router.get('/:id', auth.required, findById)

  if (routeConfig.afterInit) {
    routeConfig.afterInit(router)
  }

  function findAll (req, res, next) {
    let { filter } = req.query
    filter = filter || {}
    Model.find(
      filter.where || {},
      filter.fields && filter.fields.join(' '),
      (filter.limit || filter.skip) ?
        { skip: filter.skip, limit: filter.limit } : null,
      (err, docs) => {
        if (err) {
          res.status(400).json(err)
        } else {
          res.json(docs)
        }
      }
    )
  }

  function create (req, res, next) {
    let data = req.body
    const instance = new Model(data)

    let validationErrors = instance.validateSync()
    if (validationErrors) {
      return res.status(422).json(validationErrors)
    }

    return instance.save()
      .then(newInstance => res.json(newInstance))
      .catch(err => res.status(400).json(err))
  }

  function updateAttributes (req, res, next) {
    let query = req.query
    let data = req.body

    Model.updateMany(query, data, { multi: true }, (err, result) => {
      if (err) {
        res.status(400).json(err)
      } else {
        res.json(result)
      }
    })
  }

  function findById (req, res, next) {
    const { id } = req.params

    if (!id) {
      return res.status(422).send('No id specified')
    }

    Model.findById(id, (err, instance) => {
      if (err) {
        res.status(400).json(err)
      } else {
        res.json(instance)
      }
    })
  }

  return router
}
