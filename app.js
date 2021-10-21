const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
//const cookieSession = require('cookie-session')
const path = require('path')
const logger = require('morgan')
const crypto = require('crypto')
const sassMiddleware = require('node-sass-middleware')
const compression = require('compression')
const helmet = require('helmet')

const infoRouter = require('./routes/info')
const loginRouter = require('./routes/login')
const logbookRouter = require('./routes/logbook')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

var genSecret = crypto.createHash("sha256").update(Date.now().toString()).digest("hex")

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
// https://expressjs.com/en/advanced/best-practice-performance.html
// https://expressjs.com/en/advanced/best-practice-security.html
// https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d

app.use(logger('dev'))
app.use(helmet({
  contentSecurityPolicy: {
      directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://www.gstatic.com", "https://ajax.googleapis.com"],
          styleSrc: ["'self'", "https://cdn.jsdelivr.net", "fonts.googleapis.com", "https://use.fontawesome.com", "'unsafe-inline'"],
          fontSrc: ["'self'", "https://cdn.jsdelivr.net", "fonts.gstatic.com", "https://use.fontawesome.com"],
      }
  },
}))
/*app.use(cookieSession({
  name: 'registroChiesaCookies',
  keys: ['alwe'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'localhost', // da cambiare quando sarà in produzione
    path: '/'
  }
}))*/
app.use(session({
  genid: (req) => { return genSecret },
  name: 'registroChiesa',
	secret: genSecret, // assicurarsi che si generi periodicamente
	resave: false,
	saveUninitialized: true,
  cookie: { secure: 'auto' }
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/scss'),
  dest: path.join(__dirname, 'public/css'),
  indentedSyntax: false,
  outputStyle: 'compressed',
  debug: true,
  prefix: '/css'
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', infoRouter)
app.use('/login', loginRouter)
app.use('/logbook', logbookRouter)

app.use((req, res, next) => next(createError(404)))

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error', { error: err.status })
})

module.exports = app
