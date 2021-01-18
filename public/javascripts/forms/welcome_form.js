class WelcomeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { label: '', loading: true, score: 'X' }
    }

    componentDidMount() {
        var request = new XMLHttpRequest()
        request.open("GET", "score", false)
        request.send()

        if (request.status != 200) {
            this.props.history.replace("/l");
        } else {
            var responseObject = JSON.parse(request.response)
            let score = responseObject.GuessScore + responseObject.DrawScore
            let userName = responseObject.UserName
            this.setState({ label: userName, loading: false, score: score })
        }
    }
    
    onLogout(event) {
        var request = new XMLHttpRequest()
        request.open('POST', 'logout', false)
        request.send()

        if (request.status == 200) {
            this.props.history.replace("/l");
        }
    }

    render() {
        return (
            <div id="welcome" className="centeredcontainer">
                <p className="nick">{this.state.label}</p>
                <p className="score">{'Score: ' + this.state.score}</p>
                <form>
                    <button type="button" className="sketch1" onClick={() => this.props.history.push("/d")}>DRAW</button>
                    <button type="button" className="sketch2" onClick={() => this.props.history.push("/g")}>GUESS</button>
                    <button type="button" className="sketch4" onClick={() => this.props.history.push("/h", { userName: this.state.label })}>SCORES</button>
                    <button type="button" className="sketch3" onClick={() => this.onLogout()}>LOGOUT</button>
                </form>
            </div>
        )
    }
}
