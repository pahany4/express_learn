import {getFortune} from "./fortune.js";

/*const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
  '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
  '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')*/
const VALID_EMAIL_REGEX = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
export const home = (req, res) => {
  res.render('home')

  /** Удалить cookie */
  res.clearCookie('monster')
}

export const about = (req, res) => {
  res.render('about', {fortune: getFortune()})

  /** Установить cookie */
  res.cookie('monster', 'ням-ням')

  /** подписанные cookie */
  res.cookie('signed_monster', 'ням-ням', {signed: true})
}

export const sectionTest = (req, res) => res.render('section-test')

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
  res.status(500)
  res.render('500')
}

export const newsletterSignup = (req, res) => {
  // we will learn about CSRF later...for now, we just
  // provide a dummy value
  res.render('newsletter-signup', {
      csrf: 'CSRF token goes here',
      flash: req?.session?.flash
    }
  )
}

/*export const newsletterSignupProcess = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf)
  console.log('Name (from visible form field): ' + req.body.name)
  console.log('Email (from visible form field): ' + req.body.email)
  res.redirect(303, '/newsletter-signup/thank-you')
}*/
class NewsletterSignup {
  constructor({name, email}) {
    this.name = name
    this.email = email
  }

  async save() {
    // here's where we would do the work of saving to a database
    // since this method is async, it will return a promise, and
    // since we're not throwing any errors, the promise will
    // resolve successfully
  }
}

export const newsletterSignupProcess = (req, res) => {
  const name = req.body.name || '', email = req.body.email || ''

  // input validation
  if (!VALID_EMAIL_REGEX.test(email)) {

    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was not valid.',
    }

    return res.redirect(303, '/newsletter-signup')
  }

  // NewsletterSignup is an example of an object you might create; since
  // every implementation will vary, it is up to you to write these
  // project-specific interfaces.  This simply shows how a typical
  // Express implementation might look in your project.
  new NewsletterSignup({name, email}).save()
    .then(() => {
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for the newsletter.',
      }
      return res.redirect(303, '/newsletter-archive')
    })
    .catch(err => {
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.',
      }
      return res.redirect(303, '/newsletter-archive')
    })
}
export const newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you')

export const newsletter = (req, res) => {
  res.render('newsletter', {
      csrf: 'CSRF token goes here',
      flash: req?.session?.flash
    }
  )
}

export const api = {
  /** Чтобы отобразить bootstrap уведомления, нужна перезагрузка страницы в браузере или обработка респонса на фронте  */
  newsletterSignup: (req, res) => {
    // console.log('CSRF token (from hidden form field): ' + req.body._csrf)
    // console.log('Name (from visible form field): ' + req.body.name)
    // console.log('Email (from visible form field): ' + req.body.email)
   // res.send({result: 'success'})

    const name = req.body.name || '', email = req.body.email || ''
    // input validation
    if (!VALID_EMAIL_REGEX.test(email)) {

      req.session.flash = {
        type: 'danger',
        intro: 'Validation error!',
        message: 'The email address you entered was not valid.',
      }

      return res.redirect(303, '/newsletter')
    }

    // NewsletterSignup is an example of an object you might create; since
    // every implementation will vary, it is up to you to write these
    // project-specific interfaces.  This simply shows how a typical
    // Express implementation might look in your project.
    new NewsletterSignup({name, email}).save()
      .then(() => {
        req.session.flash = {
          type: 'success',
          intro: 'Thank you!',
          message: 'You have now been signed up for the newsletter.',
        }
         res.json({})
        console.log("then sdfsdf")
      })
      .catch(err => {
        req.session.flash = {
          type: 'danger',
          intro: 'Database error!',
          message: 'There was a database error; please try again later.',
        }
        return res.send(err)
      })

  },

  vacationPhotoContest: (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({result: 'success'})
  },

  vacationPhotoContestError: (req, res, message) => {
    res.send({result: 'error', error: message})
  }
}

export const vacationPhotoContest = (req, res) => {
  const now = new Date()
  res.render('contest/vacation-photo', {year: now.getFullYear(), month: now.getMonth()})
}
export const vacationPhotoContestAjax = (req, res) => {
  const now = new Date()
  res.render('contest/vacation-photo-ajax', {year: now.getFullYear(), month: now.getMonth()})
}
export const vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('field data: ', fields)
  console.log('files: ', files)
  res.redirect(303, '/contest/vacation-photo-thank-you')
}

export const vacationPhotoContestProcessError = (req, res, fields, files) => {
  res.redirect(303, '/contest/vacation-photo-error')
}

export const vacationPhotoContestProcessThankYou = (req, res) => {
  res.render('contest/vacation-photo-thank-you')
}