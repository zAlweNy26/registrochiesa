const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

const jobs = ['Nessuna', 'Grest', 'Doposcuola'] // SELECT Occupazione FROM lavoratori L WHERE L.LID = ?

router.get('/', async (req, res, next) => {
  if (req.session.logged) {
    let grestYears = []
    await doQuery('SELECT Anno FROM squadre').then(rs => {
      let curYear = new Date().getFullYear()
      if (rs.length == null) {
        grestYears.push(rs.Anno)
        if (rs.Anno != curYear) grestYears.push(curYear)
      } else {
        grestYears = [...new Set(rs.map(item => item.Anno))]
        if (!grestYears.find(item => item == curYear)) years.push(curYear)
      }
      grestYears = grestYears.sort((a, b) => { return a - b; })
    }).catch(err => res.send(err))
    await doQuery('SELECT Nome, Cognome FROM utenti U WHERE U.UID = ?', [req.session.sid]).then(rs => {
      req.session.name = rs.Nome
      req.session.surname = rs.Cognome
    }).catch(err => res.send(err))
    res.render('logbook', {
      name: req.session.name,
      surname: req.session.surname,
      options: grestYears,
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
