const express = require('express')
const router = express.Router()
const { doQuery } = require('../functions')

var switchTheme = ''

router.get('/', (req, res, next) => {
  //if (req.session.theme == null) req.session.theme = 'lightTheme'
  res.render('info', {
    theme: 'lightTheme' //req.session.theme
  })
})

router.post('/switchTheme', (req, res, next) => {
  switchTheme = req.body.theme
  //req.session.theme = switchTheme
})

module.exports = router
