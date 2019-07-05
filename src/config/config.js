const config = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '27017',
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_Password,
  dbName: process.env.DB_NAME || 'game-jukebox',
  dbUrl: process.env.DB_URL,

  jwtSecret: process.env.JWT_SECRET || 'abc123',
  apiPort: process.env.API_PORT || 3000,
  jwtExpirationMinutes: process.env.JWT_EXPIRATION_MINUTES || 10,

  roles: {
    admin: 1,
    client: 2
  }
}

config.dbUrl = config.dbUrl || (
  'mongodb://' +
  (
    (
      config.dbUser && config.dbPassword &&
      `${config.dbUser}@${config.dbPassword}`
    ) || ''
  ) +
  `${config.dbHost}:${config.dbPort}/${config.dbName}`
)

module.exports = config
