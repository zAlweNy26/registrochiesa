const express = require('express')
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
    await doQuery('SELECT * FROM staff_grest WHERE Nickname = ? AND Password = ?', [nick, psw]).then(rs => {
      req.session.logged = true
      req.session.sgid = rs.SGID
      res.redirect('/logbook')
    }).catch(err => res.send(err))
	} else res.send('Please enter Username and Password!')
  res.end()
})

module.exports = router
