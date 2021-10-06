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
  let obj = {}, arr = [], day = {}
  await doQuery('SELECT ID FROM utenti WHERE UID = ?', [req.session.UID]).then(rs => {
    obj.status = 200
    obj.ID = rs.ID
  }).catch(() => obj.status = 404)
  await doQuery('SELECT accompagnatore FROM partecipanti WHERE ID = ?', [obj.ID]).then(rs => {
    obj.companion = rs.accompagnatore || "Nessuno"
  }).catch(() => obj.companion = null)
  if (req.query.isGrest == 'true') {
    await doQuery(`SELECT squadre.nome AS squadra, utenti.nome, utenti.cognome FROM squadre, utenti WHERE squadre.ID = (SELECT squadra FROM ${obj.companion == null ? 'lavoratori' : 'partecipanti'} WHERE ID = ? AND anno = ?) AND utenti.ID = squadre.capo`, [obj.ID, req.query.ID]).then(rs => {
      obj.team = rs.squadra
      obj.leader = `${rs.nome} ${rs.cognome}`
    }).catch(() => obj.status = 404)
  } else {
    obj.team = null
    obj.leader = null
  }
  await doQuery(`SELECT * FROM anni WHERE ID = ?`, [req.query.ID]).then(rs => { obj.year = rs.anno }).catch(() => obj.status = 404)
  await doQuery(`SELECT * FROM programma INNER JOIN giorni ON pdata BETWEEN "${obj.year}-01-01" AND "${obj.year}-12-31" AND pdata = gdata AND ID = ?`, [obj.ID]).then(rs => {
    day.temp = rs.temperatura == null ? '❔' : rs.temperatura
    day.desc = rs.descrizione
    let today = new Date(rs.gdata)
    today.setDate(today.getDate() + 1)
    day.date = today.toISOString().split('T')[0].split("-").reverse().join("-").replace(/-/g, '/')
    day.reason = rs.motivo == null ? 'Nessuno' : rs.motivo
    day.presence = rs.assente != 0 ? '❌' : '✅' 
    day.action = rs.comportamento != 0 ? '👍' : ' 👎'
    arr.push(day)
  }).catch(() => obj.status = 404)
  obj.days = arr
  if (obj.status == 200) res.json(obj)
  else res.json({status: 404})
})

module.exports = router