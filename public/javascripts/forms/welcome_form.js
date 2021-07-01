class WelcomeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { label: 'Welcome', loading: true, score: 'X' }
  }

  componentDidMount() {
    if (this.hasCreds()) {
      this.getScore()
      this.getNews()
    } else {
      setPath("/l")
    }
  }

  hasCreds() {
    let name = window.localStorage.getItem('name')
    let token = window.localStorage.getItem('t')
    return name && token
  }

  async getScore() {
    try {
      let response = await getRequest('score')
      let responseObject = JSON.parse(response)
      let score = responseObject.GuessScore + responseObject.DrawScore
      let userName = responseObject.UserName
      this.setState({ label: userName, loading: false, score: score })
    } catch (status) {
      setPath("/l")
    }
  }

  async getNews() {
    try {
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
    } catch (status) {
      setPath("/l")
    }
  }

  async onLogout(event) {
    try {
      let response = await postRequest('logout')
      window.localStorage.removeItem('name')
      setPath("/l")
    } catch (error) {
      alert('No connection...')
      setPath("/l")
    }
  }

  onDelete(event) {
    setPath("/del")
  }

  render() {
    return (
      <div id="welcome" className="centeredcontainer">
        <p className="nick">{this.state.label}</p>
        <p className="score">{'Score: ' + this.state.score}</p>
        <form>
          <button type="button" className="sketch1" onClick={() => setPath("/d")}>DRAW</button>
          <button type="button" className="sketch2" onClick={() => setPath("/g")}>GUESS</button>
          <button type="button" className="sketch4" onClick={() => setPath("/h", { userName: this.state.label })}>SCORES</button>
          <button type="button" className="sketch3" onClick={() => this.onLogout()}>LOGOUT</button>
          <button type="button" className="sketch3" onClick={() => this.onDelete()}>DELETE</button>
        </form>

        <ul className="news">{this.state.news}</ul>
      </div>
    )
  }
}
