class GuessForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.drawingId = null
    }

    componentDidMount() {
        this.getDrawing()
    }

    getDrawing() {
        let request = new XMLHttpRequest()
        request.open('GET', 'guess', false)
        request.send()

        if (request.status == 200) {
            const drawing = JSON.parse(request.response)

            var ctx = this.refs.canvas.getContext('2d')
            var img = new Image()
            img.src = drawing.Data
            this.drawingId = drawing.DrawingId 
            img.onload = function() {
                ctx.drawImage(img, 0, 0)
            }
        } else {

        }
    }

    onSkip(event) {
        this.getDrawing()
    }

    onSubmitGuess(event) {
        var params = JSON.stringify({
            word: 'someword',
            drawingId: this.drawingId,
        })
        var request = new XMLHttpRequest()
        request.open('POST', 'guess', false)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(params)

        if (request.status == 200) {
        } else {
        }
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement('canvas', {
                ref: 'canvas',
                width: 640,
                height: 425,
            }),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: event => {
                        this.onSkip(event)
                    },
                },
                'Skip'
            ),
            React.createElement(
                'button',
                {
                    type: 'button',
                    onClick: event => {
                        this.onSubmitGuess(event)
                    },
                },
                'Guess'
            )
        )
    }
}
