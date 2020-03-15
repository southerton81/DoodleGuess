function showDashboard() {
    /*var request = new XMLHttpRequest();
    request.open("GET", "score", false);
    request.send();

    if (request.status != 200) {
        return false;
    }
    var responseObject = JSON.parse(request.response);
    let userName = request.getResponseHeader("userName")

    show(WelcomeForm, { label: userName });
*/
    return true
}

;(function main() {
    //  if (!showDashboard())
    //  show(LoginForm);

    let Router = window.ReactRouterDOM.BrowserRouter
    let Route = window.ReactRouterDOM.Route
    let Switch = window.ReactRouterDOM.Switch 

    ReactDOM.render(
        <Router> 
            <Switch>
                <Route exact path="/">
                    <WelcomeForm />
                </Route>

                <Route exact path="/l">
                    <LoginForm />
                </Route>s

                <Route exact path="/g">
                    <GuessForm />
                </Route>

                <Route exact path="/d">
                    <DrawForm />
                </Route>
            </Switch> 
        </Router>,
        document.getElementById('app')
    )
})()
