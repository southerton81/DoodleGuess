class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        return React.createElement('div', null, this.props.nodes);
    }
}