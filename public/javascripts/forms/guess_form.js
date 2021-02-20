class GuessForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { lettersCount: -1, currentLetter: -1, word: [], drawingId: null }
        this.onSkip = this.onSkip.bind(this)
        this.onSubmitGuess = this.onSubmitGuess.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onHint = this.onHint.bind(this)
    }

    componentDidMount() {
        this.getDrawing()
        document.addEventListener("keydown", this.onKeyDown, false)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown, false)
    }

    onKeyDown(event) {
        let currentLetter = this.state.currentLetter
        if (event.keyCode >= 65 && event.keyCode <= 90) { // Alpha keys
            let word = [...this.state.word]
            word[currentLetter] = String.fromCharCode(event.keyCode)
            if (++currentLetter >= this.state.lettersCount) {
                currentLetter = 0
            }
            this.setState({ ...this.state, currentLetter: currentLetter, word: word })
        } else if (event.keyCode === 37 || event.keyCode === 8) { // Back keys
            if (--currentLetter < 0) {
                currentLetter = this.state.lettersCount - 1
            }
            this.setState({ ...this.state, currentLetter: currentLetter })
        } else if (event.keyCode === 39) { // Forward key
            if (++currentLetter >= this.state.lettersCount) {
                currentLetter = 0
            }
            this.setState({ ...this.state, currentLetter: currentLetter })
        }
    }

    getDrawing() {
        let request = new XMLHttpRequest()
        request.open('GET', 'guess', false)
        request.send()

        if (request.status == 200) {
            this.showDrawing(request);
        } else {
            this.props.history.push('/')
            alert('Sorry, no more drawings available')
        }
    }

    showDrawing(request) {
        const drawing = JSON.parse(request.response)
        var ctx = this.refs.canvas.getContext('2d')
        var img = new Image()
        img.src = drawing.data
        let drawingId = drawing.drawingId
        let wordLength = drawing.wordLength
        img.onload = () => {
            ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
            ctx.drawImage(img, 0, 0)
            this.setState({
                ...this.state,
                lettersCount: wordLength,
                currentLetter: 0,
                word: Array(wordLength),
                drawingId: drawingId
            })
        }
    }

    onSkip(event) {
        var params = JSON.stringify({
            drawingId: this.state.drawingId
        })

        let request = new XMLHttpRequest()
        request.open('POST', 'skip', false)
        request.setRequestHeader('content-type', 'application/json')
        request.send(params)

        if (request.status == 200) {
            this.showDrawing(request)
        } else {
            this.props.history.replace('/')
            alert('Sorry, no more drawings available')
        }
    }

    onSubmitGuess(event) {
        var params = JSON.stringify({
            word: this.state.word.join(''),
            drawingId: this.state.drawingId
        })
        var request = new XMLHttpRequest()
        request.open('POST', 'guess', false)
        request.setRequestHeader('content-type', 'application/json')
        request.send(params)

        if (request.status == 200) {
            const guessResult = JSON.parse(request.response).result
            this.props.history.replace("/r", {
                 guessStatus: guessResult.GuessStatus,
                 word: guessResult.Word,
                 score: guessResult.Score,
                 drawingId: this.state.drawingId
                })
        } else {
            alert("Cannot submit guess...")
        }
    }

    onHint() {
        let params = "?drawingId="+encodeURIComponent(this.state.drawingId) 

        let request = new XMLHttpRequest()
        request.open('GET', 'hint' + params, false)
        request.send()

        if (request.status == 200) {
            const hint = JSON.parse(request.response) 
            this.setState({ ...this.state, word: hint, currentLetter: 1 })
        } else { 
            alert('Error occured')
        }
    }

    render() {
        let letterList = []
        for (let i = 0; i < this.state.lettersCount; i++) {
            let letter = this.state.word[i] || '*'
            let className = "guessletter "
            if (i == this.state.currentLetter) {
                className += "borderedletter "
            }
            if (letter !== '*') {
                className += "visibleLetter "
            }

            letterList.push(<li className={className}>{letter}</li>)
        }

        let element = (
            <div id="guess">
                <canvas ref="canvas" width="330" height="400"></canvas>

                <div className="centeredcontainer">
                    <ul>{letterList}</ul>
                </div>

                <div className="centeredcontainer">
                    <button type="button" className="sketch3" onClick={this.onSkip}>Skip</button>
                    <button type="button" className="sketch1" onClick={this.onSubmitGuess}>Guess</button>
                </div>

                <div className="centeredcontainer">
                    <button type="button" className="sketch2" onClick={this.onHint}>Hint</button>
                </div>
            </div>
        )
        return element
    }
}
