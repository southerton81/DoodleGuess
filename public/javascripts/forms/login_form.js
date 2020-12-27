class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.onNameChange = this.onNameChange.bind(this)
    }

    onLogin(event) {
        if (!this.state.name) {
            alert('Wrong name')
            return
        }

        var params ='name=' + encodeURIComponent(this.state.name) 
        var request = new XMLHttpRequest()
        request.open('POST', 'login', false)
        request.setRequestHeader(
            'Content-Type',
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

    render() {
        return (
            <div>
                <form>
                    <input type="text" spellCheck="false" placeholder="nick" onChange={this.onNameChange}/> 
                    <button type="button" onClick={() => this.onLogin()}><span>LOGIN</span></button>
                </form>
            </div>
        )
    }
}