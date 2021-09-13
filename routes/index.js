const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const { doQuery } = require('../functions')

var switchTheme = ''

router.get('/', (req, res, next) => {
  //if (req.session.theme == null) req.session.theme = 'lightTheme'
  res.render('info', {
    theme: 'lightTheme' //req.session.theme
  })
})

router.get('/login', (req, res, next) => {
  //if (req.session.theme == null) req.session.theme = 'lightTheme'
  res.render('login', {
    theme: 'lightTheme' //req.session.theme
  })
})

router.post('/login', async (req, res) => {
  let nick = req.body.nickname
  let psw = req.body.password
  if (nick && psw) {
    psw = crypto.createHash("sha256").update(psw).digest("hex")
    await doQuery('SELECT * FROM staff_grest WHERE Nickname = ? AND Password = ?', [nick, psw]).then(rs => {
      req.session.logged = true
      req.session.sgid = rs.SGID
      //req.session.theme = switchTheme
      res.redirect('/logbook')
    }).catch(() => res.send('Password sbagliata !'))
	} else res.send('Nome utente o password errati !')
  res.end()
})

router.post('/switchTheme', (req, res, next) => {
  switchTheme = req.body.theme
  //req.session.theme = switchTheme
})

module.exports = router
