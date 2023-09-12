const express = require('express')
const app = express()

app.use((req, res, next) => {
	console.log(`обработка запроса для ${req.url}....`)
	next()
})

/** Вызов next() запустит следующий в коде "app.use" */

app.use((req, res, next) => {
	console.log('завершаем запрос')
	res.send('Спасибо за игру!')
	// Обратите внимание, что мы здесь не вызываем next() ...
	// Запрос на этом завершается.
})

app.use((req, res, next) => {
	console.log(`Упс, меня никогда не вызовут!`)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log( `Express started on http://localhost:${port}` +
  '; press Ctrl-C to terminate.'))
