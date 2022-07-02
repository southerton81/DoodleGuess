class GuessForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { lettersCount: -1, currentLetter: -1, word: [], drawingId: null, userName: "", loading: true }
        this.onSkip = this.onSkip.bind(this)
        this.onSubmitGuess = this.onSubmitGuess.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onHint = this.onHint.bind(this)
        this.onMenu = this.onMenu.bind(this)
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

    async getDrawing() {
        try {
            let response = await getRequest('guess')
            this.showDrawing(response)
        } catch (status) {
            setPath('/')
            if (status == 401) {
                alert('Please login')
            } else {
                alert('Sorry, no more drawings available')
            }
        }
    }

    async onSkip(event) {
        try {
            let response = await postRequest('skip', JSON.stringify({
                drawingId: this.state.drawingId
            }))
            this.showDrawing(response)
        } catch (error) {
            setPath('/')
            alert('Sorry, no more drawings available')
        }
    }

    async onSubmitGuess(event) {
        try {
            let response = await postRequest('guess', JSON.stringify({
                word: this.state.word.join(''),
                drawingId: this.state.drawingId
            }))
            const guessResult = JSON.parse(response).result
            setPath("/r", {
                guessStatus: guessResult.GuessStatus,
                word: guessResult.Word,
                score: guessResult.Score,
                drawingId: this.state.drawingId
            })
        } catch (error) {
            alert('Cannot submit guess...') 
        }
    }

    async onHint() {
        try {
            let params = "?drawingId=" + encodeURIComponent(this.state.drawingId)
            let response = await getRequest('hint' + params)
            const hint = JSON.parse(response)
            this.setState({ ...this.state, word: hint, currentLetter: 1 })
        } catch (status) {
            alert('Error occured')
        }
    }

    onMenu() {
        setPath('/')
    }

    showDrawing(response) {
        const drawing = JSON.parse(response)
        var ctx = this.refs.canvas.getContext('2d')
        var img = new Image()
        img.src = drawing.data
        let drawingId = drawing.drawingId
        let wordLength = drawing.wordLength
        let userName = drawing.userName
        img.onload = () => {
            ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
            ctx.drawImage(img, 0, 0)
            this.setState({
                ...this.state,
                lettersCount: wordLength,
                currentLetter: 0,
                word: Array(wordLength),
                drawingId: drawingId,
                userName: userName,
                loading: false
            })
        }
    }

    hasTouchScreen() {
        let hasTouchScreen = false
        if ("maxTouchPoints" in navigator) {
            hasTouchScreen = navigator.maxTouchPoints > 0
        } else if ("msMaxTouchPoints" in navigator) {
            hasTouchScreen = navigator.msMaxTouchPoints > 0
        } else {
            var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
            if (mQ && mQ.media === "(pointer:coarse)") {
                hasTouchScreen = !!mQ.matches
            } else if ('orientation' in window) {
                hasTouchScreen = true
            } else {
                var UA = navigator.userAgent;
                hasTouchScreen = (
                    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
                )
            }
        }
    }

    softKeyboard() {
        let kbd = [[], [], []]
        let kbdLetters = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
        for (let i = 0; i < kbdLetters.length; i++) {
            let line = kbdLetters[i]
            for (let l = 0; l < line.length; l++) {
                let letter = line[l]
                kbd[i].push(<button style={{width: 30, height:40, fontSize: '14px', margin: '3px' }} onClick={() => {
                    this.onKeyDown({ keyCode: letter.charCodeAt(0)})
                }} key={"kbd" + l}>{letter}</button>)
            }
        }

//Not reliable!
//        if (!this.hasTouchScreen()) 
//        return (<div/>)

        return (
            <div className="centeredcontainer">
                <p>{kbd[0]}</p>
                <p>{kbd[1]}</p>
                <p>{kbd[2]}</p>
            </div>
        )
    }

    placeholders() {
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

            letterList.push(<li onClick={() => { 
                this.setState({...this.state, currentLetter: i })
            }} className={className} key={i}>{letter}</li>)
        }

        return (
            <div className="centeredcontainer">
                <ul>{letterList}</ul>
            </div>
        )
    }

    render() { 
        let element = (
            <div>
                 <div className="topmenucontainer">
                        <button type="button" className="menu" onClick={this.onMenu}>&lt; Menu</button>
                    </div>

                <div className="centeredcontainer drawWord progressAnimation" style={{ display: this.state.loading ? 'block' : 'none' }}>
                    <br/><br/>
                    {'. . .'}
                </div>

                <div id="guess" style={{ visibility: this.state.lettersCount != -1 ? 'visible' : 'hidden' }}>

                    <canvas ref="canvas" width="300" height="320"></canvas>

                    <div className="centeredcontainer author">
                        by {this.state.userName}
                    </div>

                    {this.placeholders()}

                    {this.softKeyboard()}

                    <div className="centeredcontainer">
                        <button type="button" className="sketch3" onClick={this.onSkip}>Skip</button>
                        <button type="button" className="sketch1" onClick={this.onSubmitGuess}>Ready</button>
                    </div>

                    <div className="centeredcontainer">
                        <button type="button" className="sketch2" onClick={this.onHint}>Hint</button>
                    </div>
                </div>
            </div>
            
        )
        return element
    }
}
