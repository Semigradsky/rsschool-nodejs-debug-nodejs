import express from 'express'
import bodyParser from 'body-parser'

import { sync } from './db.js'
import user from './controllers/usercontroller.js'
import game from './controllers/gamecontroller.js'
import validateSession from './middleware/validate-session.js'

const app = express()
sync()
app.use(bodyParser)
app.use('/api/auth', user)
app.use(validateSession)
app.use('/api/game', game)
app.listen(function() {
  console.log("App is listening on 4000")
})
