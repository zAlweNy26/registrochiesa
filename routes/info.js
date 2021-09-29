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

router.get('/searchID', async (req, res, next) => {
  let obj = {}
  await doQuery('SELECT utenti.nome, utenti.cognome, COALESCE(parts.accompagnatore, "Nessuno") AS accompagnatore, anni.anno, anni.servizio, parts.squadra FROM utenti, anni, (SELECT * FROM partecipanti WHERE codice = ?) AS parts WHERE utenti.ID = parts.ID AND anni.ID = parts.anno', [req.query.ID]).then(rs => {
    obj.status = 200
    obj.name = rs.nome
    obj.surname = rs.cognome
    obj.year = rs.anno
    obj.team = rs.squadra
    obj.companion = rs.accompagnatore
    obj.activity = rs.servizio
  }).catch(() => obj.status = 404)
  await doQuery('SELECT nome FROM squadre WHERE squadre.ID = ?', [obj.team]).then(rs => {
    obj.team = rs.nome
  }).catch(() => obj.team = "Nessuna")
  if (obj.status == 200) res.json(obj)
  else res.json({status: 404})
})

module.exports = router