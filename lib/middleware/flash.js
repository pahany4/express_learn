export const flashMiddleware = (req, res, next) => {
  // Если имеется уведомление,
	// переместим его в контекст, а затем удалим,
	res.locals.flash = req?.session?.flash
	delete req?.session?.flash
	next()
}
