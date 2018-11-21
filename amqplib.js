const amqp = require('amqplib')
const config = require('./config')
const generator = require('./generator')

let i = 0
function publish(channel, message) {
	i++
	const buffer = Buffer.from(JSON.stringify(message))
	const keepPublishing = channel.publish(
		config.exchange,
		config.routingKey,
		buffer
	)
	console.log(i)
	if (!keepPublishing) {
		console.error('keepPublishing', keepPublishing)
		generator.pause()
		channel.once('drain', () => generator.resume())
	}
	return keepPublishing
}

amqp
	.connect(config.amqpUrl)
	.then(conn =>
		conn.createChannel().then(async ch => {
			generator
				.on('data', data => {
					publish(ch, data)
				})
				.on('close', () => {
					ch.close()
					conn.close()
				})
		})
	)
	.catch(console.error)
