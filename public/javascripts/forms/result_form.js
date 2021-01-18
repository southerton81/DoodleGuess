
class ResultForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { message: '', word: '' }
    }

    componentWillMount() {
        if (this.props.location.state.guessStatus == 1) {
            this.setState({message: 'Correct!', word:'Score +' + this.props.location.state.score})
        } else {
            this.setState({message:"Not quite, this was ", word: this.props.location.state.word.toUpperCase()})
        }
    }

    render() {
        return (
            <div id="draw">
                <p className='score centeredcontainer'>{this.state.message}</p>  
                <p className='score centeredcontainer'>{this.state.word}</p>
                <form>
                    <button type="button" className = "sketch1" onClick={()=>this.props.history.replace("/g")}>NEXT</button>  
                </form>
            </div>
        )
    }
}