const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const crypto = require('crypto')
const sassMiddleware = require('node-sass-middleware')
const compression = require('compression')
const helmet = require('helmet')

const indexRouter = require('./routes/index')
const logbookRouter = require('./routes/logbook')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

var genSecret = crypto.createHash("sha256").update("registrogrest").digest("hex")

// https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d

app.use(logger('dev'))
app.use(helmet({
  contentSecurityPolicy: {
      directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://www.gstatic.com", "https://ajax.googleapis.com"],
          styleSrc: ["'self'", "https://cdn.jsdelivr.net", "fonts.googleapis.com", "https://use.fontawesome.com", "'unsafe-inline'"],
          fontSrc: ["'self'", "https://cdn.jsdelivr.net", "fonts.gstatic.com", "https://use.fontawesome.com"],
      }
  },
})) // Da usare quando sarà pronto per la produzione
app.use(session({
  genid: (req) => { return genSecret },
	secret: genSecret, // assicurarsi che si generi periodicamente
	resave: false,
	saveUninitialized: true,
  cookie: { secure: 'auto' }
}));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression()) // Da usare quando sarà pronto per la produzione
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
