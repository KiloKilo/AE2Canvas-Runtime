/**
 * BezierEasing - use bezier curve for transition easing function
 * based on https://github.com/gre/bezier-easing (closed-form solver of 3.2)
 * Usage:
 * var spline = BezierEasing(0.25, 0.1, 0.25, 1.0)
 * spline(x) => returns the easing value | x must be in [0, 1] range
 *
 */

// Solves x(t) = ((2a * t + 3b) * t + 3c) * t = x for t, with x in (0, 1):
// u = 1/t is the largest real root of x·u³ − 3c·u² − 3b·u − 2a = 0
// (closed-form solver from https://github.com/gre/bezier-easing)
function solveTForX(x: number, a: number, b: number, c: number) {
	var j = 1 / Math.max(c, Math.sqrt(x))
	var k = x * j
	var l = k * j
	var s = c * j
	var q = b * l
	var m = s * s + q
	var h = -s * (s * s + 1.5 * q) - a * k * l
	var D = h * h - m * m * m
	var v
	if (m === 0 || D > 1e-12 * h * h) {
		// one real root (Cardano)
		var U = -Math.cbrt(h < 0 ? h - Math.sqrt(D) : h + Math.sqrt(D))
		v = U + m / U || 0
	} else {
		// three real roots, take the largest
		var r = Math.sqrt(m)
		v = 2 * r * Math.cos(Math.acos(Math.max(-1, Math.min(1, -h / (m * r)))) / 3)
	}
	return Math.min(1, k / (v + s))
}

function BezierEasing(mX1: number, mY1: number, mX2: number, mY2: number) {
	// Validate arguments
	if (arguments.length !== 4) {
		throw new Error('BezierEasing requires 4 arguments.')
	}
	for (var i = 0; i < 4; ++i) {
		if (typeof arguments[i] !== 'number' || isNaN(arguments[i]) || !isFinite(arguments[i])) {
			throw new Error('BezierEasing arguments should be integers.')
		}
	}
	if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
		throw new Error('BezierEasing x values must be in [0, 1] range.')
	}

	// x(t) = ((2a * t + 3b) * t + 3c) * t, y(t) = ((ay * t + by) * t + cy) * t
	var a = (3 * mX1 - 3 * mX2 + 1) / 2
	var b = mX2 - 2 * mX1
	var c = mX1
	var ay = 3 * mY1 - 3 * mY2 + 1
	var by = 3 * (mY2 - 2 * mY1)
	var cy = 3 * mY1

	var f = function (aX: number) {
		if (mX1 === mY1 && mX2 === mY2) return aX // linear
		// aX outside (0, 1) saturates to 0 / 1
		if (aX <= 0) return 0
		if (aX >= 1) return 1
		var t = solveTForX(aX, a, b, c)
		return ((ay * t + by) * t + cy) * t
	}
	var str = 'BezierEasing(' + [mX1, mY1, mX2, mY2] + ')'
	f.toString = function () {
		return str
	}

	return f
}

// CSS mapping
BezierEasing.css = {
	ease: BezierEasing(0.25, 0.1, 0.25, 1.0),
	linear: BezierEasing(0.0, 0.0, 1.0, 1.0),
	'ease-in': BezierEasing(0.42, 0.0, 1.0, 1.0),
	'ease-out': BezierEasing(0.0, 0.0, 0.58, 1.0),
	'ease-in-out': BezierEasing(0.42, 0.0, 0.58, 1.0),
}

export default BezierEasing
