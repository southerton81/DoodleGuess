class HighscoresForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { highscores: [], loading: true }
    }

    componentDidMount() {
        let allScoresRequest = new XMLHttpRequest()
        allScoresRequest.open("GET", "scores", false)
        allScoresRequest.send()

        const userName = this.props.location.state.userName

        if (allScoresRequest.status == 200) {
            let responseObject = JSON.parse(allScoresRequest.response)
            let scores = []
            responseObject.map(score => {
                let totalScore = score.GuessScore + score.DrawScore
                if (userName === score.UserName) {
                    scores.push(<li className="highscoresitem selecteditem">{score.UserName + ' ' + totalScore}</li>)
                } else {
                    scores.push(<li className="highscoresitem">{score.UserName + ' ' + totalScore}</li>)
                }
            })

            this.setState({ ...this.state, highscores: scores, loading: false })
        }
    }

    render() {
        return (
            <div className="centeredcontainer" id="highscores">
                <button type="button" className = "sketch1" onClick={() => this.props.history.goBack()}>MENU</button>

                <p className="nick">{'Highscores'}</p>
                <ul className="score">{this.state.highscores}</ul>
            </div>
        )
    }
}