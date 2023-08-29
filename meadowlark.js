import express from "express";
import { engine } from 'express-handlebars';
import {about, home, /*notFound,*/ serverError} from "./lib/handlers.js";
import session from "express-session";
//import bodyParser from "body-parser";

// Для res.render() указываем имя файла вьюхи

const app = express()

/** Отключение заголовка данных о сервере */
app.disable('x-powered-by')

/*app.get('*', (req, res) => {
  res.send(`Open your dev tools and examine your headers; ` +
    `you'll notice there is no x-powered-by header!`)
})*/


const port = process.env.PORT || 4000

// configure Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

app.use(express.static(process.cwd() + '/public'))

/** Для обработки post запроса .json() и .urlencoded() встроены в express. Либо можно использовать "body-parser" */
//app.use(bodyParser.json());
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: false }))
//app.use(express.urlencoded()({ extended: false }))

app.get('/', home)

app.get('/about', about)

/** рендер с layout */
app.use(session({ resave: false, saveUninitialized: false, secret: 'keyboard cat' }))
app.get('/greeting', (req, res) => {
  res.render('greeting', {
    message: 'Hello esteemed programmer!',
    style: req.query.style,
    /** Записать нужно как-то в куки (возможно пример далее) */
    userid: req.cookies?.userid || "123",
    username: req.session.username
  })
})

/** рендер без layout (файл views/no-layout.handlebars) */
app.get('/no-layout', (req, res) =>
  res.render('no-layout', { layout: null })
)

/** Рендеринг представления с пользовательским макетом (файл views/custom-layout.handlebars) */
app.get('/custom-layout', (req, res) =>
  res.render('custom-layout', { layout: 'custom' })
)


/** заголовки запроса */
app.get('/headers', (req, res) => {
  res.type('text/plain')
  const headers = Object.entries(req.headers)
    .map(([key, value]) => `${key}: ${value}`)
  res.send(headers.join('\n'))
})


app.get('/thank-you', (req, res) => res.render('10-thank-you'))

/** обработка post запроса */
/*app.post('/process-contact', (req, res) => {
  console.log(`received contact from ${req.body.name} <${req.body.email}>`)
  res.redirect(303, '/thank-you')
})*/

/** обработка post запроса с ошибками */
app.post('/process-contact', (req, res) => {
  try {
    // here's where we would try to save contact to database or other
    // persistence mechanism...for now, we'll just simulate an error
    if(req.body.simulateError) {
      /**  "simulateError": true в json запроса, throw new Error перекидывает в catch */
      throw new Error("error saving contact!");
    }
    console.log(`contact from ${req.body.name} <${req.body.email}>`)
    res.format({
      'text/html': () => res.redirect(303, '/thank-you'),
      'application/json': () => res.json({ success: true }),
    })
  } catch(err) {
    // here's where we would handle any persistence failures
    console.error(`error processing contact from ${req.body.name} ` +
      `<${req.body.email}>`)
    res.format({
      'text/html': () =>  res.redirect(303, '/contact-error'),
      'application/json': () => res.status(500).json({
        error: 'error saving contact information' }),
    })
  }
})

// custom 404 page
app.use((req, res) =>
  res.status(404).render('404')
)

//app.use(notFound)

/** app.get поднять наверх, чтобы проверить */
//app.get('*', (req, res) => res.render('08-click-here'))

// Это должно находиться ПОСЛЕ всех ваших маршрутов.
// Обратите внимание на то, что, даже если вам
// не нужна функция "next",
// она должна быть включена, чтобы Express
// распознал это как обработчик ошибок.
app.use((err, req, res, next) => {
  console.error('** SERVER ERROR: ' + err.message)
  res.status(500).render('08-error', { message: "you shouldn't have clicked that!" })
})


// custom 500 page
app.use(serverError)

app.listen(port, () => console.log(
  `Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate.`))
