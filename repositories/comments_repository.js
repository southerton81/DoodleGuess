var User = require('../models/user.js')
var Comment = require('../models/comment.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql')

class CommentsRepository {
    constructor() {

    }

    async getComments(drawingId) {
        let userQuery = 'SELECT USER.Name FROM USER WHERE UserId = 174'
            let userRow = await DbConnection.runQuery(userQuery)

        let commentsRows = await DbConnection.runQuery(this._getCommentsQuery(drawingId))
        let commentsWithUserNames = commentsRows.map (async commentRow => { 
            let userId = commentRow.UserId 
            let userQuery = 'SELECT USER.Name FROM USER WHERE UserId = ' + userId
            let userRow = await DbConnection.runQuery(userQuery)
            return { userName: userRow[0].Name, comment: commentRow.Comment }
        })

        return Promise.all(commentsWithUserNames)
    }   

    async createComment(userId, drawingId, commentText) {
        let comment = new Comment(userId, drawingId, commentText, 
            new Date().toISOString().slice(0, 19).replace('T', ' '))
        var insertQuery = 'INSERT INTO COMMENTS SET ' + mysql.escape(comment) 
        await DbConnection.runQuery(insertQuery)
    }

    _getCommentsQuery(drawingId) {
        return ('SELECT COMMENTS.UserId, COMMENTS.Comment, COMMENTS.Timestamp FROM COMMENTS ' +
            'WHERE COMMENTS.DrawingId = ' + drawingId)
    }
}

module.exports = CommentsRepository