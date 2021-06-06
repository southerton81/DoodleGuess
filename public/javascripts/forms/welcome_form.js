class WelcomeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { label: 'Welcome', loading: true, score: 'X' }
    }

    componentDidMount() {
        this.getScore() 
        this.getNews()
    }

    async getScore() {
        try {
            let response = await getRequest('score')
            let responseObject = JSON.parse(response)
            let score = responseObject.GuessScore + responseObject.DrawScore
            let userName = responseObject.UserName
            this.setState({ label: userName, loading: false, score: score })
        } catch (status) { 
            this.props.history.replace("/l")
        }
    }

    async getNews() {
        let response = await getRequest('news')

        let newsArray = []
        JSON.parse(response).map(newsItem => {
            let date = new Date(newsItem.Timestamp * 1000)
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
            let dateText = date.toISOString().split('T')[0].replaceAll('-', '.')
            newsArray.push(<li className="newsitem" key={newsItem.Timestamp}>{dateText + ': ' + newsItem.Text}</li>)
        })

        if (newsArray.length > 0) {
            newsArray.splice(0, 0, <p key={"NEWS"}>NEWS</p>)
        }
        this.setState({ news: newsArray })
    }

    async onLogout(event) {
        try {
            let response = await postRequest('logout')
            this.props.history.replace("/l")
        } catch (error) {
            alert('No connection...') 
            this.props.history.replace("/l")
        }
    }

    onDelete(event) {
        this.props.history.replace("/del")
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
                    <button type="button" className="sketch3" onClick={() => this.onDelete()}>DELETE</button>
                </form>

                <ul className="news">{this.state.news}</ul>
            </div>
        )
    }
}
