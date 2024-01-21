var User = require('../models/user.js')
var Comment = require('../models/comment.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql2')

class CommentsRepository {
    constructor() {
    }

    async getComments(drawingId) {
        let commentsRows = await DbConnection.runQuery(this._getCommentsQuery(drawingId))
        let commentsWithUserNames = commentsRows.map (async commentRow => { 
            let userId = commentRow.UserId 
            let userQuery = 'SELECT user.Name FROM user WHERE UserId = ' + userId
            let userRow = await DbConnection.runQuery(userQuery)
            return { userName: userRow[0].Name, comment: commentRow.Comment }
        })

        return Promise.all(commentsWithUserNames)
    }   

    async createComment(userId, drawingId, commentText) {
        let comment = new Comment(userId, drawingId, commentText) 
        var insertQuery = 'INSERT INTO comments SET ' + mysql.escape(comment) 
        await DbConnection.runQuery(insertQuery)
    }

    _getCommentsQuery(drawingId) {
        return ('SELECT comments.UserId, comments.Comment, comments.Timestamp FROM comments ' +
            'WHERE comments.DrawingId = ' + drawingId)
    }
}

module.exports = CommentsRepository