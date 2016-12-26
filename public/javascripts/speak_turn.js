class SpeakTurnView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return React.createElement('img', {src: this.props.image});
    }
}

SpeakTurn = {};

SpeakTurn.show = function(imageUrl) {
    ReactDOM.render(React.createElement(SpeakTurnView, {image: imageUrl}), document.getElementById('app'));
}