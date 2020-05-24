class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.onLogin = this.onLogin.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
    }

    onLogin(event) {
        var params =
            'name=' +
            encodeURIComponent(this.state.name) +
            '&' +
            'password=' +
            encodeURIComponent(this.state.password)
        var request = new XMLHttpRequest()
        request.open('POST', 'login', false)
        request.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        )
        request.send(params)

        if (request.status == 200 || request.status == 201) {
            this.props.history.push('/')
        }
    }

    onNameChange(v) {
        this.setState({
            name: v.target.value,
        })
    }

    onPasswordChange(v) {
        this.setState({
            password: v.target.value,
        })
    }

    createLoginForm() {
        return React.createElement(
            'form',
            null,
            React.createElement('input', {
                type: 'name',
                placeholder: 'Name or email',
                onChange: this.onNameChange,
            }),
            React.createElement('input', {
                type: 'password',
                placeholder: 'password',
                onChange: this.onPasswordChange,
            }),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: this.onLogin,
                },
                'Login'
            )
        )
    }

    render() {
        return this.createLoginForm()
    }
}