import express from "express";
import { engine } from 'express-handlebars';
import {about, home, notFound, serverError} from "./lib/handlers.js";

const app = express()

/** Отключение заголовка данных о сервере */
app.disable('x-powered-by')

app.get('*', (req, res) => {
  res.send(`Open your dev tools and examine your headers; ` +
    `you'll notice there is no x-powered-by header!`)
})


const port = process.env.PORT || 4000

// configure Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

app.use(express.static(process.cwd() + '/public'))

app.get('/', home)

app.get('/about', about)

/** заголовки запроса */
app.get('/headers', (req, res) => {
  res.type('text/plain')
  const headers = Object.entries(req.headers)
    .map(([key, value]) => `${key}: ${value}`)
  res.send(headers.join('\n'))
})

// custom 404 page
app.use(notFound)

// custom 500 page
app.use(serverError)

app.listen(port, () => console.log(
  `Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate.`))
