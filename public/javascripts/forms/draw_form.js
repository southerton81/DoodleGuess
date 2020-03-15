
class DrawForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')

        let isDrawing
        let points = []
        let perlinGrad = []
        const perlinGradMax = 10
        const maxDistance = 1000
        const opaqueDistance = 800
        const perlinToDistanceFactor = maxDistance / perlinGradMax

        function samplePerlin(x) {
            const lo = Math.floor(x)
            const hi = lo + 1
            const dist = x - lo
            let loSlope = perlinGrad[lo]
            let hiSlope = perlinGrad[hi]
            var ft = dist * Math.PI,
                f = (1 - Math.cos(ft)) * 0.5
            return loSlope * (1 - f) + hiSlope * f
        }

        canvas.onmousedown = function(e) {
            isDrawing = true
            let x = e.clientX - canvas.offsetLeft
            let y = e.clientY - canvas.offsetTop

            for (let i = 0; i <= perlinGradMax; i++) {
                perlinGrad[i] = Math.random()
            }

            points.push({
                x: x,
                y: y,
                width: 2,
            })
        }
        canvas.onmousemove = function(e) {
            if (isDrawing) {
                let x = e.clientX - canvas.offsetLeft
                let y = e.clientY - canvas.offsetTop

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                let distance = 0
                for (let i = 1; i < points.length; i++) {
                    let p0 = points[i - 1]
                    let p1 = points[i]
                    distance += Math.sqrt(
                        Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
                    )
                }

                if (distance <= maxDistance) {
                    let perlinValue = samplePerlin(
                        distance / perlinToDistanceFactor
                    )
                    let width = 2 + Math.round((perlinValue * 10) / 3.5)
                    points.push({
                        x: x,
                        y: y,
                        width: width,
                    })
                }

                let opacity = 1
                distance = 0
                for (let i = 1; i < points.length; i++) {
                    let p0 = points[i - 1]
                    let p1 = points[i]
                    distance += Math.sqrt(
                        Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
                    )

                    if (distance > opaqueDistance) {
                        let rand = 0.2 * Math.random()
                        opacity = 0.6 + rand + (1 - distance / maxDistance)
                    }

                    ctx.lineJoin = ctx.lineCap = 'round'
                    ctx.strokeStyle = 'rgba(0, 15, 85, ' + opacity + ')'
                    ctx.beginPath()
                    ctx.moveTo(p0.x, p0.y)
                    ctx.lineWidth = points[i].width
                    ctx.lineTo(p1.x, p1.y)
                    ctx.stroke()
                }
            }
        }

        canvas.onmouseup = function() {
            isDrawing = false
            points.length = 0
        }

        canvas.onmouseout = function() {
            isDrawing = false
            points.length = 0
        }
    }

    onSubmit(event) {
        const canvas = this.refs.canvas
        let dataUrl = canvas.toDataURL()

        var params = JSON.stringify({ word: 'someword', image: dataUrl })
        var request = new XMLHttpRequest()
        request.open('POST', 'draw', false)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(params)

        if (request.status == 201) {
            showDashboard()
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
                        this.onSubmit(event)
                    },
                },
                'Submit'
            )
        )
    }
}
