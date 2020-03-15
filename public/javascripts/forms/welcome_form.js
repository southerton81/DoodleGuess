
class WelcomeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    onLogout(event) {
        var request = new XMLHttpRequest()
        request.open('POST', 'logout', false)
        request.send()

        if (request.status == 200) {
            show(LoginForm)
        }
    }

    render() {
        let element = React.createElement(
            'p',
            {},
            'Hello, ' + this.props.label,
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: this.onLogout,
                },
                'Logout'
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: event => {
                        show(DrawForm)
                    },
                },
                'Draw'
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: event => {
                        show(GuessForm)
                    },
                },
                'Guess'
            )
        )

        return element
    }
}
