
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
                    <Route exact path="/" component={WelcomeForm} />

                    <Route exact path="/l" component={LoginForm} />

                    <Route exact path="/g" component={GuessForm} />

                    <Route exact path="/d" component={DrawForm} />

                    <Route exact path="/h" component={HighscoresForm} />

                    <Route exact path="/del" component={DeleteForm} />
                    
                    <Route exact path="/r" component={ResultForm} />
                </Switch>
            </Router>
        )
        return element
    }
}
