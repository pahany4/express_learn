import {getFortune} from "./fortune.js";

export const home = (req, res) => res.render('home')

export const about = (req, res) => res.render('about', { fortune: getFortune() })

export const notFound = (req, res) => res.render('404')
/*export const notFound = (req, res) => {
  res.status(404)
  res.render('404')
}*/

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */

//export const serverError = (err, req, res, next) => res.render('500')
export const serverError = (err, req, res, next) => {
  console.error(err.message)
  res.status(500)
  res.render('500')
}

