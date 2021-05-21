import express from 'express'
import bodyParser from 'body-parser'

import db from './db.js'
import user from './controllers/usercontroller.js'
import game from './controllers/gamecontroller.js'
import validateSession from './middleware/validate-session.js'

const run = async () => {
  await db.sync()

  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/api/auth', user)
  app.use(validateSession)
  app.use('/api/game', game)
  app.listen(4000, function() {
    console.log("App is listening on 4000")
  })
}

run()
