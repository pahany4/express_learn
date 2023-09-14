import "dotenv/config";
import express from "express";
import {engine} from "express-handlebars";
import {
  home
} from "./lib/handlers.js";
import {requiresWaiver} from "./lib/tourRequiresWaiver.js";
import session from "express-session";
import {cartValidation} from "./lib/cartValidation.js";

const app = express()

/** Отключение заголовка данных о сервере */
app.disable('x-powered-by')

/*app.get('*', (req, res) => {
  res.send(`Open your dev tools and examine your headers; ` +
    `you'll notice there is no x-powered-by header!`)
})*/


const port = process.env.PORT || 4002

// configure Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'handlebars')

app.use(express.static(process.cwd() + '/public'))
app.use(express.json());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: { maxAge: 60000 }
}))
const products = [
  { id: 'hPc8YUbFuZM9edw4DaxwHk', name: 'Rock Climbing Expedition in Bend', price: 239.95, requiresWaiver: true },
  { id: 'eyryDtCCu9UUcqe9XgjbRk', name: 'Walking Tour of Portland', price: 89.95 },
  { id: '6oC1Akf6EbcxWZXHQYNFwx', name: 'Manzanita Surf Expedition', price: 159.95 },
  { id: 'w6wTWMx39zcBiTdpM9w5J7', name: 'Wine Tasting in the Willamette Valley', price: 229.95 },
]
const productsById = products.reduce((byId, p) => Object.assign(byId, { [p.id]: p }), {})

app.use(cartValidation.resetValidation)
app.use(cartValidation.checkWaivers)
app.use(cartValidation.checkGuestCounts)

app.get('/', (req, res) => {
  const cart = req.session.cart || { items: [] }
  const context = { products, cart }
  res.render('home', context)
})

app.post('/add-to-cart', (req, res) => {
  if(!req.session.cart) req.session.cart = { items: [] }
  const { cart } = req.session
  console.log(req.body)
  Object.keys(req.body).forEach(key => {
    if(!key.startsWith('guests-')) return
    const productId = key.split('-')[1]
    const product = productsById[productId]
    const guests = Number(req.body[key])
    if(guests === 0) return // no guests to add
    if(!cart.items.some(item => item.product.id === productId)) cart.items.push({ product, guests: 0 })
    const idx = cart.items.findIndex(item => item.product.id === productId)
    const item = cart.items[idx]
    item.guests += guests
    if(item.guests < 0) item.guests = 0
    if(item.guests === 0) cart.items.splice(idx, 1)
  })
  res.redirect('/')
})

app.listen(port, () => console.log( `Express started on http://localhost:${port}` +
  '; press Ctrl-C to terminate.'))
