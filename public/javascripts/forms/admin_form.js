class AdminForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { drawingId: null, userName: "" } 
    }

    componentDidMount() {
        this.getDrawing()
    }

    async getDrawing() {
        try {
            let response = await getRequest('adminNextDrawing')
            this.showDrawing(response)
        } catch (status) {
            if (status == 404) {
                alert('Sorry, no more drawings available')
            } else {
                alert('Error status ' + status)
            }
        }
    }

    async onValidityChange(newValidity) {
        try {
            let response = await postRequest('drawingValidity', JSON.stringify({
                drawingId: this.state.drawingId,
                validity: newValidity
            }))
            const result = JSON.parse(response).result
            alert("Validity set")
            this.getDrawing()
        } catch (error) {
            alert('Error ' + error) 
        }
    } 

    showDrawing(response) {
        const drawing = JSON.parse(response)
        var ctx = this.refs.canvas.getContext('2d')
        var img = new Image()
        img.src = drawing.data
        let drawingId = drawing.drawingId

        this.setState({
            ...this.state,
            drawingId: drawingId,
        })

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
                userName: userName
            })
        }
    }

    render() {
        let element = (
            <div id="guess" style={{ visibility: this.state.drawingId != null ? 'visible' : 'hidden' }}>
                <canvas ref="canvas" width="300" height="320"></canvas>

                <div className="centeredcontainer author">
                    by {this.state.userName}
                </div>

                <div className="centeredcontainer">
                    <button type="button" className="sketch1" onClick={() => this.onValidityChange(-1)}>Ban</button>
                    <button type="button" className="sketch3" onClick={() => this.onValidityChange(1)}>OK</button> 
                </div>
            </div>
        )
        return element
    }
}
