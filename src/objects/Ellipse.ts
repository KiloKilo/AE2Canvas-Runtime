import Property from '../property/Property'
import AnimatedProperty from '../property/AnimatedProperty'
import Path, { type PathProps, Vertex } from './Path'

class Ellipse extends Path {
	private readonly size: Property<[number, number]>
	private readonly position?: Property<[number, number]>

	constructor(data: PathProps) {
		super(data)
		this.closed = true

		this.size = data.size.length > 1 ? new AnimatedProperty(data.size) : new Property(data.size)

		if (data.position) {
			this.position = data.position.length > 1 ? new AnimatedProperty(data.position) : new Property(data.position)
		}
	}

	draw(ctx: CanvasRenderingContext2D, time: number) {
		const size = this.size.getValue(time)
		const position = this.position ? this.position.getValue(time) : [0, 0]

		let i
		let j
		const w = size[0] / 2
		const h = size[1] / 2
		const x = position[0] - w
		const y = position[1] - h
		const ow = w * 0.5522848
		const oh = h * 0.5522848

		const vertices: Vertex[] = [
			[x + w + ow, y, x + w - ow, y, x + w, y],
			[x + w + w, y + h + oh, x + w + w, y + h - oh, x + w + w, y + h],
			[x + w - ow, y + h + h, x + w + ow, y + h + h, x + w, y + h + h],
			[x, y + h - oh, x, y + h + oh, x, y + h],
		]
		ctx.moveTo(vertices[0][4], vertices[0][5])
		for (i = 0; i < 4; i++) {
			j = i + 1
			if (j > 3) j = 0
			ctx.bezierCurveTo(
				vertices[i][0],
				vertices[i][1],
				vertices[j][2],
				vertices[j][3],
				vertices[j][4],
				vertices[j][5]
			)
		}
	}

	setKeyframes(time: number) {
		this.size.setKeyframes(time)
		if (this.position) this.position.setKeyframes(time)
	}

	reset(reversed: boolean) {
		this.size.reset(reversed)
		if (this.position) this.position.reset(reversed)
	}
}

export default Ellipse
