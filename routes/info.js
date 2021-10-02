const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

router.get('/', (req, res, next) => {
  if (req.session.theme == null) req.session.theme = 'lightTheme'
  res.render('info', {
    theme: req.session.theme
  })
})

router.post('/switchTheme', async (req, res, next) => {
  req.session.theme = req.body.theme
  await req.session.save()
})

router.get('/searchUser', async (req, res, next) => {
  let obj = {}
  req.session.UID = req.query.UID
  await doQuery('SELECT * FROM utenti WHERE UID = ?', [req.query.UID]).then(rs => {
    obj.status = 200
    obj.ID = rs.ID
    obj.name = rs.nome
    obj.surname = rs.cognome
  }).catch(() => obj.status = 404)
  await Promise.all([doQuery('SELECT * FROM anni WHERE ID IN (SELECT anno FROM partecipanti WHERE partecipanti.ID = ?)', [obj.ID]).catch(error => { return error }), 
  doQuery('SELECT * FROM anni WHERE ID IN (SELECT anno FROM lavoratori WHERE lavoratori.ID = ?)', [obj.ID]).catch(error => { return error })]).then(values => {
    let activities = [], rs = (values[0] || values[1])
    if (rs.length == null) activities.push({ID: rs.ID, service: rs.servizio, year: rs.anno})
    else rs.forEach(act => activities.push({ID: act.ID, service: act.servizio, year: act.anno}))
    obj.activities = activities
  })
  if (obj.status == 200) res.json(obj)
  else res.json({status: 404})
})

router.get('/getServiceInfo', async (req, res, next) => {
  let obj = {}
  await doQuery('SELECT ID FROM utenti WHERE UID = ?', [req.session.UID]).then(rs => {
    obj.status = 200
    obj.ID = rs.ID
  }).catch(() => obj.status = 404)
  /*await doQuery('SELECT * FROM anni WHERE ID = ?', [req.query.ID]).then(rs => {
    obj.year = rs.anno
  }).catch(() => obj.status = 404)*/
  obj.year = "Prova"
  if (obj.status == 200) res.json(obj)
  else res.json({status: 404})
})

module.exports = router