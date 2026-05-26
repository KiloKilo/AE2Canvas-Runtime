import Bezier from '../utils/Bezier'
import { type Frame } from '../property/Property'

export type PathProps = {
	position?: []
	size: []
	closed: boolean
	frames: Frame<Vertex[]>[]
	isAnimated?: boolean
	type: 'path' | 'rect' | 'ellipse' | 'polystar'
	outerRoundness?: []
	innerRoundness?: []
	rotation?: []
	outerRadius: []
	innerRadius: []
	points: []
	starType: number
}

export type Vertex = [number, number, number, number, number, number]

class Path {
	public closed: boolean
	public frames: Frame<Vertex[]>[]
	private bezier?: Bezier

	constructor(data: PathProps) {
		this.closed = data.closed
		this.frames = data.frames
	}

	draw(ctx: CanvasRenderingContext2D, time: number) {
		const frame = this.getValue(time)
		this.drawNormal(frame, ctx)
	}

	drawNormal(frame: { v: Vertex[]; len: number[] }, ctx: CanvasRenderingContext2D) {
		const vertices = frame.v
		const numVertices = this.closed ? vertices.length : vertices.length - 1
		let lastVertex = null
		let nextVertex = null

		for (let i = 1; i <= numVertices; i++) {
			lastVertex = vertices[i - 1]
			nextVertex = vertices[i] ? vertices[i] : vertices[0]
			if (i === 1) ctx.moveTo(lastVertex[4], lastVertex[5])
			ctx.bezierCurveTo(lastVertex[0], lastVertex[1], nextVertex[2], nextVertex[3], nextVertex[4], nextVertex[5])
		}

		if (this.closed) {
			//todo check
			if (!nextVertex) {
				debugger
				return
			}
			ctx.bezierCurveTo(
				nextVertex[0],
				nextVertex[1],
				vertices[0][2],
				vertices[0][3],
				vertices[0][4],
				vertices[0][5]
			)
			ctx.closePath()
		}
	}

	getValue(time: number): { v: Vertex[]; len: number[] } {
		return { v: this.frames[0].v as Vertex[], len: this.frames[0].len }
	}

	lerp(a: number, b: number, t: number) {
		const s = 1 - t
		return a * s + b * t
	}

	sumArray(arr: number[]) {
		function add(a: number, b: number) {
			return a + b
		}

		return arr.reduce(add)
	}

	isStraight(
		startX: number,
		startY: number,
		ctrl1X: number,
		ctrl1Y: number,
		ctrl2X: number,
		ctrl2Y: number,
		endX: number,
		endY: number
	) {
		return startX === ctrl1X && startY === ctrl1Y && endX === ctrl2X && endY === ctrl2Y
	}

	setKeyframes(time: number) {}

	reset(reversed: boolean) {}
}

export default Path
