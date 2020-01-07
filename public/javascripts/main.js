var nodes = [];

var TurnId = {
    SPEAK: 0,
    LISTEN: 1
}

function showDashboard() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "score", false);
    xhttp.send();

    if (xhttp.status != 200) {
        return false;
    }

    var responseObject = JSON.parse(xhttp.response);

    let userName = xhttp.getResponseHeader("userName")

    nodes = [];
    nodes.push(React.createElement(WelcomeForm, { label: userName }));

    console.log('score = ' + responseObject.Score)
    // if (responseObject.turn == TurnId.SPEAK)
    //    nodes.push(React.createElement(SpeakTurnForm, { image: responseObject.image }));

    renderApp(nodes);
    return true;
}

function renderApp(nodes) {
    ReactDOM.render(React.createElement(App, { nodes: nodes }), document.getElementById('app'));
}

function showLogin() {
    nodes = [];
    nodes.push(React.createElement(LoginForm, null));
    renderApp(nodes);
}

(function main() {
    if (!showDashboard())
        showLogin();
}());