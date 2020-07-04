class GuessForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { lettersCount: -1, currentLetter: -1, word: [] }
        this.drawingId = null
        this.onSkip = this.onSkip.bind(this)
        this.onSubmitGuess = this.onSubmitGuess.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
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
            const drawing = JSON.parse(request.response)
            var ctx = this.refs.canvas.getContext('2d')
            var img = new Image()
            img.src = drawing.data
            this.drawingId = drawing.drawingId
            let wordLength = drawing.wordLength
            img.onload = () => {
                ctx.drawImage(img, 0, 0)
                this.setState({ ...this.state, 
                    lettersCount: wordLength, 
                    currentLetter: 0, 
                    word: Array(wordLength) })
            }
        } else {

        }
    }

    onSkip(event) {
        this.getDrawing()
    }

    onSubmitGuess(event) {
        var params = JSON.stringify({
            word: 'someWord',
            drawingId: this.drawingId,
        })
        var request = new XMLHttpRequest()
        request.open('POST', 'guess', false)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(params)

        if (request.status == 200) {
            const guessResult = JSON.parse(request.response)
            if (guessResult.status == 1) {
                console.log('yes')
            } else {
                console.log('no')
            }
        } else {
             
        }
    }

    render() {
        let letterList = []
        for (let i = 0; i < this.state.lettersCount; i++) {
            let letter = this.state.word[i] || '*'
            let className = ""
            if (i == this.state.currentLetter) {
                className = "selectedLetter "
            }
            if (letter !== '*') {
                className += "visibleLetter "
            }
                
            letterList.push(<li className={className}>{letter}</li>)
        }

        let element = (
            <div id="guess">
                <canvas ref="canvas" width="640" height="425"></canvas>
                <ul>{letterList}</ul>
                <button type="button" onClick={this.onSkip}>Skip</button>
                <button type="button" onClick={this.onSubmitGuess}>Guess</button>
            </div>
        )
        return element
    }
}
