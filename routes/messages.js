const express = require('express')
const router = new express.Router()
const Message = require('../models/message')
const { ensureCorrectUser } = require('../middleware/auth')

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureCorrectUser, async (req, res, next) => {
  try {
    const { id } = req.params
    const msg = await Message.get(id)
    return res.json({ message: msg })
  } catch (err) {
    return next(err)
  }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', async (req, res, next) => {
  try {
    const from_username = req.params.username
    const { to_username, body } = req.body
    const msg = await Message.create({ from_username, to_username, body })
    return res.json({ message: msg })
  } catch (err) {
    return next(err)
  }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureCorrectUser, async (req, res, next) => {
  try {
    const { id } = req.params
    const msg = await Message.markRead(id)
    return res.json({ message: { id: msg.id, read_at: msg.read_at }})
  } catch (err) {
    return next(err)
  }
})