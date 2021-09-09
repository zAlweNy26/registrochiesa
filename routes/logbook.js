const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

router.get('/', async (req, res, next) => {
  if (req.session.logged) {
    let grestYears = ''
    await doQuery('SELECT Anno FROM squadre').then(rs => {
      let curYear = new Date().getFullYear()
      let years = []
      if (rs.length == null) {
        years.push(rs.Anno)
        if (rs.Anno != curYear) years.push(curYear)
      } else {
        years = [...new Set(rs.map(item => item.Anno))]
        if (!years.find(item => item == curYear)) years.push(curYear)
      }
      years.sort((a, b) => { return a - b; }).forEach(item => grestYears += `<option ${item == curYear ? 'selected' : ''} value="${item}">${item}</option>`)
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
      years: grestYears
    })
  } else res.redirect('/login');
})

router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router
