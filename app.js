const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')

const indexRouter = require('./routes/index')
const logbookRouter = require('./routes/logbook')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(session({
  //genid: (req) => { return genuuid() },
	secret: 'registrogrest', // da cambiare, generandolo periodicamente e con stringa alfanumerica
	resave: false,
	saveUninitialized: true,
  cookie: { secure: 'auto' }
}));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/css'),
  indentedSyntax: false,
  outputStyle: 'compressed',
  debug: true,
  prefix: '/css'
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/logbook', logbookRouter)

app.use((req, res, next) => next(createError(404)))

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
