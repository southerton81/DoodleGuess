
class ResultForm extends React.Component {
    constructor(props) {
        super(props)
        this.onCommentChange = this.onCommentChange.bind(this)
        this.state = { message: '', word: '', comments: [] }
    }

    componentWillMount() {
        if (this.props.location.state.guessStatus == 1) {
            this.setState({message: 'Correct!', word: 'Score +' + this.props.location.state.score})
        } else {
            this.setState({message:"Not quite, this was ", word: this.props.location.state.word.toUpperCase()})
        }
    }

    componentDidMount() {
        let params = "?drawingId="+encodeURIComponent(this.props.location.state.drawingId) 
        let request = new XMLHttpRequest()
        request.open('GET', 'comments' + params, false)
        request.send()

        const commentsList = JSON.parse(request.response)

        if (request.status == 200) {
            this.setState({...this.state, comments: commentsList})
        }
    }

    onNext() {
        this.props.history.replace("/g")

        let newComment = this.state.newComment
        if (newComment && newComment.length > 0) {
            var params = JSON.stringify({
                drawingId: this.props.location.state.drawingId,
                comment: newComment
            })
            var request = new XMLHttpRequest()
            request.open('POST', 'comment', false)
            request.setRequestHeader('content-type', 'application/json')
            request.send(params)
        }
    }

    onCommentChange(v) {
        this.setState({...this.state, newComment: v.target.value})
    }
    
    render() {
        let commentsList = []
        for (let i = 0; i < this.state.comments.length; i++) {
            let commentObject = this.state.comments[i]
            commentsList.push(<li className={"comment"}>{commentObject.userName + ": " +commentObject.comment}</li>)
        }

        if (commentsList.length > 0) { 
            commentsList.unshift(<li className={"commentTitle"}>{"COMMENTS"}</li>)
        }

        return (
            <div id="draw">
                <p className='resultMessage centeredcontainer'>{this.state.message}</p>  
                <p className='resultMessage centeredcontainer'>{this.state.word}</p>
                <br/><br/><br/>
                <div className="scrollable" id="comments">
                    <ul>{commentsList}</ul>
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