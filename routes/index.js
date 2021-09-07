const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { doQuery } = require('../functions')

router.get('/', (req, res, next) => {
  res.redirect('/login')
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  let nick = req.body.nickname
  let psw = req.body.password
  if (nick && psw) {
    psw = crypto.createHash("sha256").update(psw).digest("hex")
    await doQuery('SELECT * FROM staff_grest WHERE Nickname = ? AND Password = ?', [nick, psw]).then(rs => {
      req.session.logged = true
      req.session.sgid = rs.SGID
      res.redirect('/logbook')
    }).catch(() => res.send('Password sbagliata !'))
	} else res.send('Nome utente o password errati !')
  res.end()
})

module.exports = router
