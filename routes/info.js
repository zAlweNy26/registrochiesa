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
  await doQuery('SELECT utenti.nome, utenti.cognome, COALESCE(parts.accompagnatore, "Nessuno") AS accompagnatore, COALESCE(squadre.nome, "Nessuna") AS squadra, anni.anno, anni.servizio FROM utenti, squadre, anni, (SELECT * FROM partecipanti WHERE codice = ?) AS parts WHERE utenti.ID = parts.ID AND anni.ID = parts.anno AND (parts.squadra IS NULL OR squadre.ID = parts.squadra) AND parts.squadra IS NOT NULL', [req.query.ID]).then(rs => {
    console.log(rs)
    res.json({ 
      status: 200,
      name: rs.nome,
      surname: rs.cognome,
      team: rs.squadra,
      year: rs.anno,
      companion: rs.accompagnatore,
      activity: rs.servizio
    })
  }).catch(() => res.json({ status: 404 })) // farlo funzionare in caso di accompagnatore NULL e/o squadra NULL
})

module.exports = router