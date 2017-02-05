var nodes = [];

var TurnId = {
    SPEAK: 0,
    LISTEN: 1
}

function showGame() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "dashboard", false);
    xhttp.send();

    if (xhttp.status != 200) 
        return false;

    var responseObject = JSON.parse(xhttp.response);
    onShowTurn(xhttp.getResponseHeader("userName"), responseObject);
    return true;
}

function renderApp(nodes) {
    ReactDOM.render(React.createElement(App, { nodes: nodes }), document.getElementById('app'));
}

function onShowTurn(userName, responseObject) {
    nodes = [];
    nodes.push(React.createElement(WelcomeForm, { label : userName }));

    if (responseObject.turn == TurnId.SPEAK)
        nodes.push(React.createElement(SpeakTurnForm, { image: responseObject.image }));

    renderApp(nodes);
}

function onShowLogin() {
    nodes = [];
    nodes.push(React.createElement(LoginForm,  null));
    renderApp(nodes);
}

(function main() {
    if (!showGame())
        onShowLogin();
} ());