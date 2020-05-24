
class WelcomeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loading: true }

        var request = new XMLHttpRequest()
        request.open("GET", "score", false)
        request.send()

        if (request.status != 200) {
            this.props.history.push("/l");
        } else {
            var responseObject = JSON.parse(request.response)
            let userName = request.getResponseHeader("userName")
            this.setState({ label: userName, loading: false })
        }
    }

    onLogout(event) {
        var request = new XMLHttpRequest()
        request.open('POST', 'logout', false)
        request.send()

        if (request.status == 200) {
            this.props.history.push("/l");
        }
    }

    render() {
        let element = React.createElement(
            'p',
            {},
            'Hello, ' + this.state.label,
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: this.onLogout.bind(this),
                },
                'Logout'
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: event => {
                        this.props.history.push("/d");
                    },
                },
                'Draw'
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: event => {
                        this.props.history.push("/g");
                    },
                },
                'Guess'
            )
        )

        return element
    }
}
