class WelcomeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { label: '', loading: true }
    }

    componentDidMount() {
        var request = new XMLHttpRequest()
        request.open("GET", "score", false)
        request.send()

        if (request.status != 200) {
            this.props.history.push("/l");
        } else {
            var responseObject = JSON.parse(request.response)
            let userName = responseObject.UserName
            this.setState({ label: userName, loading: false })
        }
    }

    onLogout(event) {
        var request = new XMLHttpRequest()
        request.open('POST', 'logout', false)
        request.send()

        if (request.status == 200) {
            this.props.history.push("/l");
        }
    }

    render() {
        return (
            <div id="welcome">                                          
                <p>{'Hello ' + this.state.label}</p>
                <button type="button" onClick={() => this.props.history.push("/d")}><span>DRAW</span></button>
                <button type="button" onClick={() => this.props.history.push("/g")}><span>GUESS</span></button>
                <button type="button" onClick={() => this.onLogout()}><span>LOGOUT</span></button>
                <HighscoresForm/>
            </div>
        )
    }
}
