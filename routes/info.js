const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

router.get('/', async (req, res, next) => {
  if (req.session.theme == null) req.session.theme = 'lightTheme'
  let activities = [], i = 1
  await doQuery('SELECT nome FROM servizi').then(rs => {
    rs.forEach(act => activities.push({ID: i++, service: act.nome}))
  }).catch(err => console.log(err))
  res.render('info', {
    theme: req.session.theme,
    services: activities
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
    obj.name = rs.nome
    obj.surname = rs.cognome
  }).catch(() => obj.status = 404)
  await Promise.all([doQuery('SELECT * FROM anni WHERE ID IN (SELECT anno FROM partecipanti WHERE partecipanti.UID = ?)', [req.query.UID]).catch(error => { return error }), 
  doQuery('SELECT * FROM anni WHERE ID IN (SELECT anno FROM lavoratori WHERE lavoratori.UID = ?)', [req.query.UID]).catch(error => { return error })]).then(values => {
    let activities = [], rs = (values[0] || values[1])
    if (rs.length == null) activities.push({ID: rs.ID, service: rs.servizio}) // aggiungere suddivisione per periodi
    else rs.forEach(act => activities.push({ID: act.ID, service: act.servizio})) // aggiungere suddivisione per periodi
    obj.activities = activities
  })
  if (obj.status == 200) res.json(obj)
  else res.json({status: 404})
})

router.get('/getInfoByUser', async (req, res, next) => {
  let obj = {}, days = []
  await doQuery('SELECT accompagnatore FROM partecipanti WHERE UID = ?', [req.session.UID]).then(rs => {
    obj.companion = rs.accompagnatore || "Nessuno"
  }).catch(() => obj.companion = null)
  if (req.query.isGrest == 'true') {
    await doQuery(`SELECT squadre.nome AS squadra, utenti.nome, utenti.cognome FROM squadre, utenti WHERE squadre.ID = (SELECT squadra FROM ${obj.companion == null ? 'lavoratori' : 'partecipanti'} WHERE UID = ? AND anno = ?) AND utenti.UID = squadre.capo`, [req.session.UID, req.query.ID]).then(rs => {
      obj.team = rs.squadra
      obj.leader = `${rs.nome} ${rs.cognome}`
    }).catch(() => obj.status = 404)
  } else {
    obj.team = null
    obj.leader = null
  }
  await doQuery(`SELECT DATE_FORMAT(dataInizio, "%Y-%m-%d") as inizio, DATE_FORMAT(dataFine, "%Y-%m-%d") as fine FROM anni WHERE ID = ?`, [req.query.ID]).then(rs => { 
    obj.begin = rs.inizio
    obj.end = rs.fine 
  }).catch(() => obj.status = 404)
  console.log(`SELECT *, DATE_FORMAT(pdata, "%d/%m/%Y") as data FROM programma INNER JOIN giorni ON pdata BETWEEN '${obj.begin}' AND '${obj.end}' AND pdata = gdata AND UID = ?`)
  await doQuery(`SELECT *, DATE_FORMAT(pdata, "%d/%m/%Y") as data FROM programma INNER JOIN giorni ON pdata BETWEEN '${obj.begin}' AND '${obj.end}' AND pdata = gdata AND UID = ?`, [req.session.UID], true).then(rs => {
    rs.forEach(d => {
      days.push({
        temp: d.temperatura == null ? '❔' : d.temperatura + " °C",
        desc: d.descrizione,
        date: d.data,
        reason: d.motivo == null ? "Nessuno" : d.motivo,
        presence: d.assente != 0 ? '❌' : '✅' ,
        action: d.comportamento == null ? '❔' : (d.comportamento != 0 ? '👍' : ' 👎')
      })
    })
    obj.status = 200
  }).catch(() => obj.status = 404)
  obj.days = days
  console.log(obj)
  if (obj.status == 200) res.json(obj)
  else res.json({status: 404})
})

router.get('/getServiceInfo', async (req, res, next) => {
  let obj = {}
  await doQuery('SELECT prezzo, descrizione, DATE_FORMAT(dataInizio, "%d/%m/%Y") as inizio, DATE_FORMAT(dataFine, "%d/%m/%Y") as fine FROM servizi, anni WHERE nome = ? AND servizio = ?', [req.query.activity, req.query.activity]).then(rs => {
    obj.status = 200
    obj.price = rs.prezzo
    obj.desc = rs.descrizione
    obj.begin = rs.inizio
    obj.end = rs.fine
  }).catch(() => obj.status = 404)
  if (obj.status == 200) res.json(obj)
  else res.json({status: 404})
})

module.exports = router