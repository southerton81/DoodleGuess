class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.onNameChange = this.onNameChange.bind(this)
    }

    onLogin(event) {
        if (!this.state.name) {
            alert('Please enter nickname')
            return
        }

        alert('Hi ' + this.state.name)
        var params ='name=' + encodeURIComponent(this.state.name) 
        var request = new XMLHttpRequest()
        request.open('POST', 'login', false)
        request.setRequestHeader(
            'content-type',
            'application/x-www-form-urlencoded'
        )
        request.send(params)

        if (request.status == 200 || request.status == 201) {
            this.props.history.push('/')
        } else if (request.status == 401) {
            alert('Nickname already taken')
        } else {
            alert('Error occurred')
        }
    }

    onNameChange(v) {
        this.setState({
            name: v.target.value,
        })
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