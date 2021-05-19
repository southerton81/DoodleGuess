let AdminRepository = require('./../repositories/admin_repository.js')
var DatabaseError = require('./../error/errors.js').DatabaseError

const adminRepository = new AdminRepository()

AdminController = {}

AdminController.validateNext = function (req, res, next) {
    adminRepository
        .getNonValidDrawing()
        .then(drawing => {
            let drawingId = drawing.DrawingId
            let data = drawing.Data
            let wordLength = drawing.Word.length
            let userName = drawing.UserName
            res.json({ drawingId, data, wordLength, userName })
            res.status(200)
            res.end()
        })
        .catch(err => {
            if (err instanceof DatabaseError) { 
                res.status(404)
                res.end()
            } else {
                next(err)
            }
        })
}

AdminController.drawingValidity = function (req, res, next) {
    adminRepository.setDrawingValidity(req.body.drawingId, req.body.validity)
        .then(result => {
            res.status(200)
            res.json({ result }).end()
        }).catch(err => {
            this.adminError(err)
        })
} 

AdminController.adminError = function(err) {
    console.log(err.stack)
    res.status(500)
    res.end()
}

module.exports = AdminController