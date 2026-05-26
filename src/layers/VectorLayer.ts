import AnimatedPath from '../objects/AnimatedPath'
import Ellipse from '../objects/Ellipse'
import Path from '../objects/Path'
import Polystar from '../objects/Polystar'
import Rect from '../objects/Rect'
import Fill from '../property/Fill'
import Stroke from '../property/Stroke'
import BaseLayer, { BaseLayerProps } from './BaseLayer'

class VectorLayer extends BaseLayer {
	private fill?: Fill
	private stroke?: Stroke
	private groups?: VectorLayer[]
	private shapes?: (Path | Rect | Ellipse | Polystar)[]

	constructor(data: BaseLayerProps) {
		super(data)

		if (data.fill) this.fill = new Fill(data.fill)
		if (data.stroke) this.stroke = new Stroke(data.stroke)

		if (data.groups) {
			this.groups = data.groups.map((group) => new VectorLayer(group))
		}

		if (data.shapes) {
			this.shapes = data.shapes
				.map((shape) => {
					if (shape.type === 'path') {
						return shape.isAnimated ? new AnimatedPath(shape) : new Path(shape)
					} else if (shape.type === 'rect') {
						return new Rect(shape)
					} else if (shape.type === 'ellipse') {
						return new Ellipse(shape)
					} else if (shape.type === 'polystar') {
						return new Polystar(shape)
					}
				})
				.filter(Boolean) as (Path | Rect | Ellipse | Polystar)[]
		}
	}

	draw(ctx: CanvasRenderingContext2D, time: number, scale: number, parentFill: Fill, parentStroke: Stroke) {
		super.draw(ctx, time, scale)

		const fill = this.fill || parentFill
		const stroke = this.stroke || parentStroke

		if (fill) fill.update(ctx, time)
		if (stroke) stroke.update(ctx, time)

		ctx.beginPath()
		if (this.shapes) {
			this.shapes.forEach((shape) => shape.draw(ctx, time))
			if (this.shapes[this.shapes.length - 1].closed) {
				// ctx.closePath();
			}
		}

		if (fill) ctx.fill()
		if (stroke) ctx.stroke()

		if (this.groups) this.groups.forEach((group) => group.draw(ctx, time, scale, fill, stroke))
		ctx.restore()
	}

	setKeyframes(time: number) {
		super.setKeyframes(time)

		if (this.shapes) this.shapes.forEach((shape) => shape.setKeyframes(time))
		if (this.groups) this.groups.forEach((group) => group.setKeyframes(time))

		if (this.fill) this.fill.setKeyframes(time)
		if (this.stroke) this.stroke.setKeyframes(time)
	}

	reset(reversed: boolean) {
		super.reset(reversed)

		if (this.shapes) this.shapes.forEach((shape) => shape.reset(reversed))
		if (this.groups) this.groups.forEach((group) => group.reset(reversed))

		if (this.fill) this.fill.reset(reversed)
		if (this.stroke) this.stroke.reset(reversed)
	}
}

export default VectorLayer
