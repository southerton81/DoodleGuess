class PerlinPen {

    constructor() {
        this.totalPoints = []
        this.points = []
        this.perlinGrad = []
        this.perlinGradMax = 10
        this.maxDistance = 1000
        this.opaqueDistance = 300
        this.perlinToDistanceFactor = this.maxDistance / this.perlinGradMax
        this.basicWidth = 2
        this.width = this.basicWidth
    }

    samplePerlin(x) {
        const lo = Math.floor(x)
        const hi = lo + 1
        const dist = x - lo
        let loSlope = this.perlinGrad[lo]
        let hiSlope = this.perlinGrad[hi]
        var ft = dist * Math.PI,
            f = (1 - Math.cos(ft)) * 0.5
        return loSlope * (1 - f) + hiSlope * f
    }

    startNewSegment(x, y) {
        for (let i = 0; i <= this.perlinGradMax; i++) {
            this.perlinGrad[i] = Math.min(0.6, Math.max(0.4, Math.random()))
        }

        this.points = []
        this.totalPoints.push(this.points)
        this.points.push({
            x: x,
            y: y,
            width: this.basicWidth,
        })
    }

    addPointToSegment(x, y) {
        let distance = 0
        let lastDistance = 0
        for (let seg = 0; seg < this.totalPoints.length; seg++) {
            let segmentPoints = this.totalPoints[seg]
            for (let i = 1; i < segmentPoints.length; i++) {
                let p0 = segmentPoints[i - 1]
                let p1 = segmentPoints[i]
                lastDistance = Math.sqrt(
                    Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
                )
                distance += lastDistance
            }
        }

        if (distance <= this.maxDistance) {
            let perlinValue = this.samplePerlin(
                distance / this.perlinToDistanceFactor
            )
  
            let targetWidth = Math.max(this.basicWidth, 7 - lastDistance)
            if (this.width !== targetWidth) {
                this.width += targetWidth > this.width ? .2 : -.2
            } 
            this.width += Math.round((perlinValue) / 3.5)

            this.points.push({
                x: x,
                y: y,
                width: this.width,
            })
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        let distance = 0
        for (let seg = 0; seg < this.totalPoints.length; seg++) {
            let segmentPoints = this.totalPoints[seg]
            let opacity = 1
            for (let i = 1; i < segmentPoints.length; i++) {
                let p0 = segmentPoints[i - 1]
                let p1 = segmentPoints[i]
                distance += Math.sqrt(
                    Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
                )

                ctx.lineJoin = ctx.lineCap = 'round'
                ctx.strokeStyle = 'rgba(0, 15, 85, 255)'
                ctx.beginPath()
                ctx.moveTo(p0.x, p0.y)
                ctx.lineWidth = segmentPoints[i].width
                ctx.lineTo(p1.x, p1.y)
                ctx.stroke()
            }
        }
    }


}