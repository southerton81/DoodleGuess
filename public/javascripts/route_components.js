class RouteComponent extends React.Component { 

    constructor(props) {
        super(props)
        this.state = {}

        setPath = (newPath, props) => { 
            if (useRouter) {
                this.props.history.push(newPath, props)
            } else {
                this.setState({ path: newPath, properties: props }) 
            }
        }
    }

    render() {  
        if (useRouter) {
            let Router = window.ReactRouterDOM.BrowserRouter
            let Route = window.ReactRouterDOM.Route
            let Switch = window.ReactRouterDOM.Switch

            return (
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
        } else {
            switch (this.state.path) {
                case '/l':
                    return <LoginForm/>
                case '/g':
                    return <GuessForm/> 
                case '/d':
                    return <DrawForm/> 
                case '/h':
                    return <HighscoresForm location = { { state: this.state.properties } } /> 
                case '/del':
                    return <DeleteForm/> 
                case '/r':
                    return <ResultForm location = { { state: this.state.properties } } />
                default:
                    return <WelcomeForm/>
              }
        }
    }
}
