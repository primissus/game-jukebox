const { User } = require('../models')
const { roles } = require('../config/config')

User.create({ email: 'admin@mail.com', password: 'password', role: roles.admin })
