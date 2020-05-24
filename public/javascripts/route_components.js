
class RouteComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let Router = window.ReactRouterDOM.BrowserRouter
        let Route = window.ReactRouterDOM.Route
        let Switch = window.ReactRouterDOM.Switch

        let element = (
            <Router>
                <Switch>
                    <Route exact path="/" component={WelcomeForm}>
                    </Route>

                    <Route exact path="/l" component={LoginForm}>
                    </Route>

                    <Route exact path="/g" component={GuessForm}> 
                    </Route>

                    <Route exact path="/d"  component={DrawForm}> 
                    </Route>
                </Switch>
            </Router>
        )
        return element
    }
}
