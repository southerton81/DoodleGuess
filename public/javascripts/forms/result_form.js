
class ResultForm extends React.Component {
    constructor(props) {
        super(props)
        this.onCommentChange = this.onCommentChange.bind(this)
        this.state = { message: '', word: '', comments: [] }
    }

    componentWillMount() {
        if (this.props.location.state.guessStatus == 1) {
            this.setState({message: 'Correct!', word: 'Score up by ' + this.props.location.state.score})
        } else {
            this.setState({message:"Not quite, this was ", word: this.props.location.state.word.toUpperCase()})
        }
    }

    componentDidMount() {
        this.getComments()
    }

    onNext() {
        this.props.history.replace("/g")

        let newComment = this.state.newComment
        if (newComment && newComment.length > 0) {
            this.postComment(newComment)
        }
    }

    async getComments() {
        let params = "?drawingId="+encodeURIComponent(this.props.location.state.drawingId) 
        let response = await getRequest('comments' + params)
        let commentsList = JSON.parse(response)
        this.setState({...this.state, comments: commentsList})
    }

    async postComment(newComment) { 
        var params = JSON.stringify({
            drawingId: this.props.location.state.drawingId,
            comment: encodeURIComponent(newComment)
        })
        await postRequest('comment', params) 
    }

    onCommentChange(v) {
        this.setState({...this.state, newComment: v.target.value})
    }
    
    render() {
        let commentsList = []
        for (let i = 0; i < this.state.comments.length; i++) {
            let commentObject = this.state.comments[i]

            let c = decodeURIComponent(commentObject.comment) 
            commentsList.push(<li className={"comment"} key={commentObject.userName}>{commentObject.userName + ": " + c}</li>)
        }

        if (commentsList.length > 0) { 
            commentsList.unshift(<li className={"commentTitle"} key={"commentTitle"}>{"COMMENTS"}</li>)
        }

        return (
            <div id="draw">
                <p className='resultMessage centeredcontainer'>{this.state.message}</p>  
                <p className='resultMessage centeredcontainer'>{this.state.word}</p>
                <br/><br/><br/>
                <div className="scrollable" id="comments">
                    <ul className="scrollable">{commentsList}</ul>
                </div>
                <form>
                    <input type="text" className="sketch2 wide" maxLength="64" spellCheck="false"
                        placeholder="Comment?" onChange={this.onCommentChange}/> 
                </form>
                <form>
                    <button type="button" className="sketch1" onClick={()=>this.onNext()}>NEXT</button>  
                </form>
            </div>
        )
    }
}