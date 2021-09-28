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
  await doQuery('SELECT * FROM utenti, anni, squadre, (SELECT * FROM partecipanti WHERE codice = ?) AS part WHERE utenti.ID = part.ID', [req.query.ID]).then(rs => {
    console.log(rs)
    res.json({ 
      status: 200
      //name: rs.nome,
      //surname: rs.cognome,
      //team: rs.squadra,
      //year: rs.anno,
      //companion: rs.accompagnatore
    })
  }).catch(() => res.json({ status: 404 }))
})

module.exports = router
