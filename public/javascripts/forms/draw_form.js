
class DrawForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { wordLabel: '' }
    }

    componentDidMount() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')
        const perlinPen = new PerlinPen()
        let isDrawing

        canvas.onmousedown = function(e) {
            isDrawing = true
            let x = e.clientX - canvas.offsetLeft
            let y = e.clientY - canvas.offsetTop
            perlinPen.startNewSegment(x, y)    
        }

        canvas.onmousemove = function(e) {
            if (isDrawing) {
                let x = e.clientX - canvas.offsetLeft
                let y = e.clientY - canvas.offsetTop
                perlinPen.addPointToSegment(x, y)
                perlinPen.draw(ctx)
            }
        }

        canvas.onmouseup = function() {
            isDrawing = false
        }

        canvas.onmouseout = function() {
            isDrawing = false
        }

        var request = new XMLHttpRequest()
        request.open('POST', 'createDrawing', false)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send()

        if (request.status == 201) {
            const drawing = JSON.parse(request.response)
            this.setState({ wordLabel: drawing.Word, drawingId: drawing.DrawingId })
        }
    }

    onSubmit(event) {
        const canvas = this.refs.canvas
        let dataUrl = canvas.toDataURL()

        var params = JSON.stringify({ drawingId: this.state.drawingId, image: dataUrl }) 
        var request = new XMLHttpRequest()
        request.open('POST', 'draw', false)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(params)

        if (request.status == 201) {
            this.props.history.push('/')
        }
    }       

    render() {
        return (
            <div id="draw">
                <canvas ref="canvas" width="640" height="425"></canvas>
                <p>{ this.state.wordLabel }</p>
                <button type="button" onClick={this.onSubmit.bind(this)}>Submit</button> 
            </div>
        )
    }
}

