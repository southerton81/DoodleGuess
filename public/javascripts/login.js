class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onLogin = this.onLogin.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    onLogin(event) {
        var params = "name=" + encodeURIComponent(this.state.name) + "&" + "password=" + encodeURIComponent(this.state.password);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "login", false);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.send(params);

        if (xhttp.status == 200 || xhttp.status == 201) {
            updateDashboard();
        }

        alert(xhttp.status);
    }

    onNameChange(v) {
        this.setState({
            name: v.target.value
        });
    }

    onPasswordChange(v) {
        this.setState({
            password: v.target.value
        });
    }

    createLoginForm() {
        return React.createElement('form', {},
            React.createElement('input', {
                type: 'name',
                placeholder: 'Name or email',
                onChange: this.onNameChange
            }),
            React.createElement('input', {
                type: 'password',
                placeholder: 'password',
                onChange: this.onPasswordChange
            }),
            React.createElement('button', {
                type: 'button',
                onClick: this.onLogin
            }, "Login"));
    }

    render() {
        return this.createLoginForm();
    }
}

class WelcomeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onLogout(event) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "logout", false);
        xhttp.send();

        if (xhttp.status == 200) {
            ReactDOM.render(React.createElement(LoginForm, null), document.getElementById('header'));
        }
    }

    render() {
        let element = React.createElement('p', {},
            "Hello, " + this.props.label,
            React.createElement('button', {
                type: 'button',
                onClick: this.onLogout
            }, "Logout"));

        return element;
    }
}

function updateDashboard() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "dashboard", false);
    xhttp.send();

    if (xhttp.status != 200)
        return false;

    ReactDOM.render(React.createElement(WelcomeForm, {label: xhttp.getResponseHeader("userName")}),
        document.getElementById('header'));

    var responseObject = JSON.parse(xhttp.response);
    if (responseObject.turn == "speak")
        SpeakTurn.show(responseObject.image);

    return true;
}

(function main() {
    if (!updateDashboard())
        ReactDOM.render(React.createElement(LoginForm, null), document.getElementById('header'));
} ());