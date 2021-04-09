var CommentsRepository = require('./../repositories/comments_repository.js')


const commentsRepository = new CommentsRepository()

CommentsController = {}

CommentsController.getComments = function (req, res, next) { 
    commentsRepository.getComments(req.query.drawingId)
        .then(comments => {
            res.status(200)
            res.json(comments)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

CommentsController.createComment = function (req, res, next) {
    let userId = req.user.UserId
    let drawingId = req.body.drawingId
    let comment = req.body.comment

    commentsRepository.createComment(userId, drawingId, comment)
        .then(_ => {
            res.status(201)
            res.end()
        })
        .catch(err => {
            return next(err)
        })
}

module.exports = CommentsController