class HighscoresForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { highscores: [], loading: true }
    }

    componentDidMount() {
        let allScoresRequest = new XMLHttpRequest()
        allScoresRequest.open("GET", "scores", false)
        allScoresRequest.send()

        if (allScoresRequest.status == 200) {
            let responseObject = JSON.parse(allScoresRequest.response)
            let scores = []
            responseObject.map (score => {
                scores.push(<li>{score.UserName + ' ' + score.GuessScore + ' ' + score.DrawScore}</li>)
            })

            this.setState({ ...this.state, highscores: scores, loading: false }) 
        }
    }

    render() {
        return (
            <div id="highscores">                                          
                <p>{'Highscores'}</p>
                <ul>{this.state.highscores}</ul>
            </div>
        )
    }
}