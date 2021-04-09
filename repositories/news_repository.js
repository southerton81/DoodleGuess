var User = require('../models/user.js')
var NewsItem = require('../models/news_item.js')
var DbConnection = require('../db/db_connection.js')
var mysql = require('mysql')
var AuthError = require('../error/errors.js').AuthError
var UserNotFoundError = require('../error/errors.js').UserNotFoundError

class NewsRepository {
    async getNews(userId) {
 
        
       
        await Promise.all([DbConnection.runQuery(_getGuessNewsQuery()),
            DbConnection.runQuery(_getCommentsNewsQuery())])



        return [new NewsItem("ts", "2"), new NewsItem("ts2", "2")]
    }

    _getGuessNewsQuery() {
        'SELECT USER.Name, DRAWINGS.UserId, HISTORY.UserId, HISTORY.Result, HISTORY.Timestamp' +
            'FROM DRAWINGS' +

            'JOIN HISTORY ON HISTORY.DrawingId = DRAWINGS.DrawingId' +
            'JOIN USER ON USER.UserId = HISTORY.UserId' +
            
            'WHERE DRAWINGS.UserId = 129 ORDER BY HISTORY.Timestamp DESC LIMIT 25;'

        /*
        Find all results from history for CurrentUserId as an author of drawing.
        We are interested with a name of user who guessed drawings and timestamp of this event.

        1) Join history with drawings on drawingId and find only rows in this join where
           Drawings.UserId = CurrentUserId.
        2) Join these found rows with User table to get the name of the user who guessed the drawing.
        */
    } 

    _getCommentsNewsQuery() {
        'SELECT USER.Name, COMMENTS.Comment, COMMENTS.Timestamp' +

        'FROM COMMENTS' +

        'JOIN DRAWINGS ON DRAWINGS.DrawingId = COMMENTS.DrawingId' +
        'JOIN USER ON USER.UserId = COMMENTS.UserId' +

        'WHERE DRAWINGS.UserId = 129 ORDER BY COMMENTS.Timestamp DESC LIMIT 25;'

        /* 
        Find all recent user Name, Comment, Timestamp of users who commented my drawings.
        */
    }
}


module.exports = NewsRepository