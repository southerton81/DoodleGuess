
class ResultForm extends React.Component {
    constructor(props) {
        super(props)
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

        var params = JSON.stringify({
            drawingId: this.props.location.state.drawingId,
            comment: "fd"
        })
        var request = new XMLHttpRequest()
        request.open('POST', 'comment', false)
        request.setRequestHeader('content-type', 'application/json')
        request.send(params)
    }

    render() {
        let commentsList = []
        for (let i = 0; i < this.state.comments.length; i++) {
            let className = "comment"
            commentsList.push(<li className={className}>{this.state.comments[i]}</li>)
        }

        return (
            <div id="draw">
                <p className='score centeredcontainer'>{this.state.message}</p>  
                <p className='score centeredcontainer'>{this.state.word}</p>
                <br/><br/><br/>
                <div id="comments" className = "centeredcontainer scrollable">
                    <ul>{commentsList}</ul>
                </div>
                <form>
                    <input type="text" className="sketch2 wide" maxLength="64" spellCheck="false"
                        placeholder="comment" onChange={this.onNameChange} /> 
                </form>
                <form>
                    <button type="button" className = "sketch1" onClick={()=>this.onNext()}>NEXT</button>  
                </form>
            </div>
        )
    }
}