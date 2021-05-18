import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import { importModel } from '../db.js'
import UserModel from '../models/user.js'

const compare = promisify(bcrypt.compare)

const router = Router()
const User = importModel(UserModel)

const createToken = (userId) => jwt.sign(
  { id: userId },
  'lets_play_sum_games_man',
  { expiresIn: 60 * 60 * 24 },
)

router.post('/signup', async (req, res) => {
  try {
    const user = await User.create({
      full_name: req.body.user.full_name,
      username: req.body.user.username,
      passwordhash: bcrypt.hashSync(req.body.user.password, 10),
      email: req.body.user.email,
    })

    res.status(200).json({
      user: user,
      token: createToken(user.id),
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.post('/signin', async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.user.username } })

  if (!user) {
    return res.status(403).send({ error: "User not found." })
  }

  const matches = await compare(req.body.user.password, user.passwordHash)
  if (!matches) {
    return res.status(502).send({ error: "Passwords do not match." })
  }

  res.json({
    user: user,
    message: "Successfully authenticated.",
    sessionToken: createToken(user.id),
  })
})

export default router
