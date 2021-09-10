const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

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
    await doQuery('SELECT Nome, Cognome FROM persone P WHERE P.PID = ?', [req.session.sgid]).then(rs => {
      req.session.name = rs.Nome
      req.session.surname = rs.Cognome
    }).catch(err => res.send(err))
    await doQuery('SELECT * FROM animatori A, squadre S WHERE A.AID = ? AND A.Squadra = S.SID', [req.session.sgid]).then(rs => {
      req.session.team = rs.Nome
    }).catch(() => req.session.team = "Nessuna")
    res.render('logbook', {
      name: req.session.name,
      surname: req.session.surname,
      team: req.session.team,
      options: grestYears,
      theme: 'lightTheme' //req.session.theme
    })
  } else res.redirect('/login');
})

router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router
