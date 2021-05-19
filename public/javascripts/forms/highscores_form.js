class HighscoresForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { highscores: [], loading: true }
    }

    componentDidMount() {
        this.getScores()
    }

    async getScores() {
        try {
            let response = await getRequest('scores')
            let responseObject = JSON.parse(response)
            const userName = this.props.location.state.userName
            let scores = []
            responseObject.map(score => {
                let totalScore = score.GuessScore + score.DrawScore

                if (userName === score.UserName) {
                    scores.push(<li className="highscoresitem selecteditem" key={score.UserName}><p>{score.UserName}</p><p>{totalScore}</p></li>)
                } else {
                    scores.push(<li className="highscoresitem" key={score.UserName}><p>{score.UserName}</p><p>{totalScore}</p></li>)
                }
            })

            this.setState({ ...this.state, highscores: scores, loading: false })
        } catch (status) {
            if (status == 401) {
                this.props.history.push('/')
                alert('Please login')
            } else {
                alert("No connection...")
            }
        }
    }

    render() {
        return (
            <div>
                <div className="topmenucontainer">
                    <button type="button" className="menu" onClick={() => this.props.history.goBack()}>&lt; Menu</button>
                </div>
                <div className="centeredcontainer" id="highscores">
                    <p className="nick">{'Highscores'}</p>
                    <ul className="score">{this.state.highscores}</ul>
                </div>
            </div>
        )
    }
}