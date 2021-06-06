var User = require('../models/user.js')
var NewsItem = require('../models/news_item.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql2')
var AuthError = require('../error/errors.js').AuthError
var UserNotFoundError = require('../error/errors.js').UserNotFoundError

class NewsRepository {
    async getNews(userId) {
        let newGuessesRows = await DbConnection.runQuery(this._getGuessNewsQuery(userId))

        let guessNewsItems = newGuessesRows.map(row => { 
            let name = row.Name
            let word = row.Word
            return new NewsItem(row.UNIX_TS, name + " guessed your " + word + " picture")
        })

        let newCommentsRows = await DbConnection.runQuery(this._getCommentsNewsQuery(userId))

        let commentsNewsItems = newCommentsRows.map(row => {
            let name = row.Name
            let word = row.Word
            let comment = row.Comment
            return new NewsItem(row.UNIX_TS, name + " commented your "  + word + " picture: " + comment)
        })

        return [...guessNewsItems, ...commentsNewsItems]
    }

    _getGuessNewsQuery(currentUserId) {
        return ('SELECT USER.Name, DRAWINGS.Word, UNIX_TIMESTAMP(HISTORY.Timestamp) AS UNIX_TS ' +
            'FROM DRAWINGS ' +

            'JOIN HISTORY ON HISTORY.DrawingId = DRAWINGS.DrawingId ' +
            'JOIN USER ON USER.UserId = HISTORY.UserId ' +
            
            'WHERE (DRAWINGS.UserId = ' + currentUserId + ' AND History.Result = 1) ORDER BY UNIX_TS DESC LIMIT 20;')

        /*
        Find all results from history for CurrentUserId as an author of drawing.
        We are interested with a name of user who guessed drawings, result and timestamp of this event.

        1) Join history with drawings on drawingId and find only rows in this join where
           Drawings.UserId = CurrentUserId.
        2) Join these found rows with User table to get the name of the user who guessed the drawing.
        */
    } 

    _getCommentsNewsQuery(currentUserId) {
        return ('SELECT USER.Name, DRAWINGS.Word, COMMENTS.Comment, UNIX_TIMESTAMP(COMMENTS.Timestamp) AS UNIX_TS ' +
        'FROM COMMENTS ' +

        'JOIN DRAWINGS ON DRAWINGS.DrawingId = COMMENTS.DrawingId ' +
        'JOIN USER ON USER.UserId = COMMENTS.UserId ' +

        'WHERE DRAWINGS.UserId =' + currentUserId + ' ORDER BY UNIX_TS DESC LIMIT 20;')

        /* 
        Find all recent user Name, Comment, Timestamp of users who commented my drawings.
        */
    }
}


module.exports = NewsRepository