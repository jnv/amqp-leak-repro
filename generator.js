const { randomObject } = require('random-object')
const { Readable } = require('readable-stream')

class DataGenerator extends Readable {
	constructor(opt) {
		super({ ...opt, objectMode: true })
		this._max = 100000
		this._index = 0
	}

	_read() {
		const i = this._index++
		if (i > this._max) this.push(null)
		else {
			process.nextTick(() => {
				this.push(randomObject(100, 10))
			})
		}
	}
}

module.exports = new DataGenerator()

if (require.main === module) {
	const stream = new DataGenerator()
	stream.on('data', obj => {
		console.log(obj)
	})
}
