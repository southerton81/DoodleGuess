var Comment = function(userId, drawingId, comment, ts) {  
    this.UserId = userId
    this.DrawingId = drawingId
    this.Comment = comment
    this.Timestamp = ts
}

module.exports = Comment