import {Router} from "express";
import axios from "axios";

export const unisender = Router()

const send_email = async (name, subject, body) => {
  return axios.get(`https://api.unisender.com/ru/api/sendEmail?format=json&api_key=${process.env.UNISENDER_API_KEY}&email=test@gokengu.ru.ru&sender_name=express&sender_email=test2@gogengu.ru&subject=${subject}&body=${body}`)
}
unisender.post("/unisender/send", (req, res) => {
  send_email(
    req.body.name,
    req.body.subject,
    req.body.body,
  ).then((response) => {
    console.log(response.data)
    res.json({message: "Исполнено"})
  })
    .catch(() => res.status(500))
  /*console.log(req.body)
  axios.get(`https://api.unisender.com/ru/api/sendEmail?format=json&api_key=${process.env.UNISENDER_API_KEY}&email=gaydukov@gokengu.ru.ru&sender_name=${req.body.name}&sender_email=test2@gogengu.ru&subject=${req.body.subject}&body=${req.body.body}`)
    .then((response) => {
      console.log(response)
      res.json({message: "Исполнено"})
    })
    .catch(() => res.status(500))*/
})