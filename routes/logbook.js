const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

router.get('/', async (req, res, next) => {
  if (req.session.logged) {
    let activities = []
    await doQuery('SELECT * FROM anni INNER JOIN ruoli ON anni.servizio = ruoli.servizio AND ruoli.ID = ?', [req.session.role]).then(rs => {
      if (rs.length == null) activities.push({ID: rs.ID, service: rs.servizio, year: rs.anno})
      else rs.forEach(act => activities.push({ID: act.ID, service: act.servizio, year: act.anno}))
    }).catch(err => res.send(err))
    await doQuery('SELECT nome, cognome FROM utenti WHERE ID = ?', [req.session.ID]).then(rs => {
      req.session.name = rs.nome
      req.session.surname = rs.cognome
    }).catch(err => res.send(err))
    res.render('logbook', {
      name: req.session.name,
      surname: req.session.surname,
      services: activities,
      tables: [1, 2, 3, 4, 5, 6],
      theme: 'lightTheme' //req.session.theme
    })
  } else res.redirect('/login');
})

router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router
