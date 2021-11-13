const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

router.get('/', async (req, res, next) => {
  if (req.session.logged) {
    let activities = [], fullName = ""
    await doQuery('SELECT * FROM anni INNER JOIN ruoli ON anni.servizio = ruoli.servizio AND ruoli.ID = ?', [req.session.role], true).then(rs => {
      rs.forEach(act => activities.push({ID: act.ID, service: act.servizio})) // aggiungere suddivisione per periodi
    }).catch(err => res.send(err))
    await doQuery('SELECT nome, cognome FROM utenti WHERE UID = ?', [req.session.UID]).then(rs => {
      fullName = rs.nome + " " + rs.cognome
    }).catch(err => res.send(err))
    if (req.session.theme == null) req.session.theme = 'lightTheme'
    res.render('logbook', {
      fullName: fullName,
      services: activities,
      tables: [1, 2, 3, 4, 5, 6],
      theme: req.session.theme
    })
  } else res.redirect('/login');
})

router.get('/logout', (req, res, next) => {
  //req.session.destroy()
  req.session.logged = false
  req.session.UID = null
  req.session.role = null
  res.redirect('/login')
})

module.exports = router
