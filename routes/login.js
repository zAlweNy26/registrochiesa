const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { doQuery } = require('../functions')

router.get('/', (req, res, next) => {
  if (req.session.theme == null) req.session.theme = 'lightTheme'
  res.render('login', { theme: req.session.theme })
})

router.post('/', async (req, res) => {
  let nick = req.body.nickname
  let psw = req.body.password
  if (nick && psw) {
    psw = crypto.createHash("sha256").update(psw).digest("hex")
    await doQuery('SELECT staff.ID as ID, UID, ruolo FROM staff, utenti WHERE nickname = ? AND password = ? AND utenti.ID = staff.ID', [nick, psw]).then(rs => {
      req.session.logged = true
      req.session.UID = rs.UID
      req.session.role = rs.ruolo
      res.redirect('/logbook')
    }).catch(() => res.send('Password sbagliata !'))
	} else res.send('Nome utente o password errati !')
  res.end()
})

module.exports = router
