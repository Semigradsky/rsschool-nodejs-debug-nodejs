import { Router } from 'express'

import db from '../db.js'
import GameModel from '../models/game.js'

const router = Router()
const Game = db.import('game', GameModel)

router.get('/all', async (req, res) => {
  try {
    const games = await Game.findAll({ where: { owner_id: req.user.id } })

    res.status(200).json({
      games,
      message: "Data fetched."
    })
  } catch (err) {
    res.status(500).json({
      message: "Data not found"
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({
      where: { id: req.params.id, owner_id: req.user.id }
    })

    res.status(200).json({ game })
  } catch (err) {
    res.status(500).json({
      message: "Data not found."
    })
  }
})

router.post('/create', async (req, res) => {
  try {
    const game = await Game.create({
      title: req.body.game.title,
      owner_id: req.user.id,
      studio: req.body.game.studio,
      esrb_rating: req.body.game.esrb_rating,
      user_rating: req.body.game.user_rating,
      have_played: req.body.game.have_played
    })

    res.status(200).json({
      game,
      message: "Game created."
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.put('/update/:id', async (req, res) => {
  try {
    const game = await Game.update(
      {
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
      },
      {
        where: {
          id: req.params.id,
          owner_id: req.user.id
        }
      }
    )

    res.status(200).json({
      game,
      message: "Successfully updated."
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.delete('/remove/:id', async (req, res) => {
  try {
    const game = await Game.destroy({
      where: {
        id: req.params.id,
        owner_id: req.user.id
      }
    })

    res.status(200).json({
      game,
      message: "Successfully deleted"
    })
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})

export default router
