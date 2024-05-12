const handler404 = (req, res) => {
    res.status(404).render('notFound')
}
  
const handlerServerErrors = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render('serverError')
}
  
module.exports = {
    handler404,
    handlerServerErrors,
}
  