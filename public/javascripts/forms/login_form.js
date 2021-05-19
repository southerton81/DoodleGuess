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
            let response = await postRequest('login', 'name=' + encodeURIComponent(this.state.name), 'application/x-www-form-urlencoded')
            alert('Hi ' + this.state.name)
            this.props.history.push('/')
        } catch (error) {
            if (error == 401)
                alert('Nickname already taken')
            else
                alert('Error occurred')
        }
    }

    onNameChange(v) {
        let value = v.target.value.trim()
        this.setState({name: value})
    }

    onHandleKey(e) {
        if (e.key == 'Enter') {
            this.onLogin()
        }
    }

    render() {
        return (
            <div>
                <form>
                    <p className="title">Doodle Guess Game</p>  
                    <p/>
                    <input autoFocus type="text" className="sketch1" maxLength="20" spellCheck="false" placeholder="nick"
                        onChange={this.onNameChange} onKeyDown={(e) => this.onHandleKey(e)}/> 
                    <p/>
                    <button type="button" className="sketch1" onClick={() => this.onLogin()}>LOGIN</button>
                </form>
            </div>
        )
    }
}