
class DrawForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { wordLabel: '', inkLeft: 100 }
    }

    componentDidMount() {
        this.initPen()
        this.createDrawing()
        this.initTouchSupport(this.refs.canvas)
    }

    initTouchSupport(canvas) {
        canvas.addEventListener("touchstart", function (e) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            })
            canvas.dispatchEvent(mouseEvent)
        }, false)

        canvas.addEventListener("touchend", function (e) {
            var mouseEvent = new MouseEvent("mouseup", {})
            canvas.dispatchEvent(mouseEvent);
        }, false)

        canvas.addEventListener("touchmove", function (e) {
            var touch = e.touches[0]
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            })
            canvas.dispatchEvent(mouseEvent);
        }, false)

        document.body.addEventListener("touchstart", function (e) {
            if (e.target == canvas) {
                e.preventDefault()
            }
        }, false)

        document.body.addEventListener("touchend", function (e) {
            if (e.target == canvas) {
                e.preventDefault()
            }
        }, false)

        document.body.addEventListener("touchmove", function (e) {
            if (e.target == canvas) {
                e.preventDefault()
            }
        }, false)
    }

    initPen() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')
        const inkProgress = this.refs.inkProgress
        this.setState({ ...this.state, inkLeft: 100 })
        const perlinPen = new PerlinPen()
        let isDrawing = false
        let drawForm = this

        canvas.onmousedown = function (e) {
            isDrawing = true
            let pos = this.getMousePosition(this, e)
            perlinPen.startNewSegment(pos[0], pos[1])
        }

        canvas.onmousemove = function (e) {
            if (isDrawing) {
                let pos = this.getMousePosition(this, e)
                perlinPen.addPointToSegment(pos[0], pos[1])
                let inkUsed = perlinPen.draw(ctx)
                drawForm.setState({ ...this.state, inkLeft: 100 - (inkUsed * 100) })
            }
        }

        canvas.onmouseup = function () {
            isDrawing = false
        }

        canvas.onmouseout = function () {
            isDrawing = false
        }

        canvas.getMousePosition = function (canvas, event) {
            let x = 0
            let y = 0

            if (event.pageX != undefined && event.pageY != undefined) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft
                y = event.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop
            }

            x -= canvas.offsetLeft
            y -= canvas.offsetTop

            return [x, y]
        }
    }

    async createDrawing() {
        try {
            let response = await postRequest('createDrawing', null)
            const drawing = JSON.parse(response)
            this.setState({ wordLabel: drawing.Word, drawingId: drawing.DrawingId })
        } catch (status) {
            if (status == 401) {
                alert('Please login')
            } else {
                alert("Error creating new drawing...")
            }
            this.props.history.push('/')
        }
    }

    async onSubmit(event) {
        const canvas = this.refs.canvas
        let dataUrl = canvas.toDataURL()

        if (this.state.inkLeft == 100) {
            alert("Drawing is empty")
        } else {
            try {
                let params = JSON.stringify({ drawingId: this.state.drawingId, image: dataUrl })
                let response = await postRequest('draw', params)
                alert("Submit successfull")
                this.props.history.push('/')
            } catch (status) {
                if (status == 401) {
                    this.props.history.push('/')
                    alert('Please login')
                } else {
                    alert("No connection error...")
                }
            }
        }
    }

    onClear(event) {
        var ctx = this.refs.canvas.getContext('2d')
        ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        this.initPen()
    }

    onMenu() {
        this.props.history.replace('/')
    }

    render() {
        const inkProgressStyle = {
            width: this.state.inkLeft + '%'
        }
        return (
            <div id="draw">
                <div className="topmenucontainer">
                    <button type="button" className="menu" onClick={this.onMenu.bind(this)}>&lt; Menu</button>
                </div>
                <div className="centeredcontainer drawWord">{this.state.wordLabel}</div>
                <p />
                <canvas ref="canvas" width="300" height="320"></canvas>
                <p />

                <div className="centeredcontainer">
                    <div id="inkContainer" className="centeredchild">
                        <div id="inkProgress" ref="inkProgress" style={inkProgressStyle}>
                            <div></div>
                        </div>
                    </div>
                </div>
                <p />

                <div className="centeredcontainer">
                    <button type="button" className="sketch2 centeredchild" onClick={this.onClear.bind(this)}>CLEAR</button>
                    <button type="button" className="sketch1 centeredchild" onClick={this.onSubmit.bind(this)}>SUBMIT</button>
                </div>
            </div>
        )
    }
}

