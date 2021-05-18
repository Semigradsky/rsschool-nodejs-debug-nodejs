import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import { importModel } from '../db.js'
import UserModel from '../models/user.js'

const User = importModel(UserModel)

const verifyToken = promisify(jwt.verify)

export default async (req, res, next) => {
  if (req.method == 'OPTIONS') {
    return next()   // allowing options as a method for request
  }

  const sessionToken = req.headers.authorization
  console.log(sessionToken)
  if (!sessionToken) {
    return res.status(403).send({ auth: false, message: "No token provided." })
  }

  const decoded = await verifyToken(sessionToken, 'lets_play_sum_games_man')
  if (!decoded) {
    return res.status(400).send({ error: "not authorized" })
  }

  try {
    const user = await User.findOne({ where: { id: decoded.id } })
    req.user = user
    console.log(`user: ${user}`)
    next()
  } catch (err) {
    res.status(401).send({ error: "not authorized" })
  }
}
