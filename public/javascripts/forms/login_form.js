class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onNameChange = this.onNameChange.bind(this)
  }

  async onLogin(event) {
    if (!this.state.name) {
      alert('Please enter nickname')
      return
    }

    try {
      window.localStorage.setItem('name', this.state.name)
      let response = await postRequest('login')
      if (response) {
        let responseJson = JSON.parse(response)
        if (responseJson && responseJson.token) {
          window.localStorage.setItem('t', responseJson.token)
        }
      }

      setPath('/')
    } catch (error) {
      if (error == 401)
        alert('Nickname already taken')
      else
        alert('Error occurred')
    }
  }

  onNameChange(v) {
    let value = v.target.value.trim()
    this.setState({ name: value })
  }

  render() {
    return (
      <div>
        <form onSubmit={ e => { e.preventDefault(); this.onLogin(); } }>
          <p className="title">Doodle Guess Game</p>
          <p />
          <input autoFocus type="text" className="sketch1" maxLength="20" spellCheck="false" placeholder="nick" onChange={this.onNameChange} />
          <p />
          <button type="button" className="sketch1" onClick={() => this.onLogin()}>LOGIN</button>
        </form>
      </div>
    )
  }
}