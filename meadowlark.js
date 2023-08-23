import express from "express";
import { engine } from 'express-handlebars';
import {about, home, notFound, serverError} from "./lib/handlers.js";

const app = express()

const port = process.env.PORT || 4000

// configure Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

app.use(express.static(process.cwd() + '/public'))

app.get('/', home)

app.get('/about', about)

// custom 404 page
app.use(notFound)

// custom 500 page
app.use(serverError)

app.listen(port, () => console.log(
  `Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate.`))
