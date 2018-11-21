const amqp = require('amqp-connection-manager')
const config = require('./config')
const generator = require('./generator')

const connection = amqp.connect([config.amqpUrl])
connection.on('connect', function() {
	console.log('Connected!')
})
connection.on('disconnect', function(params) {
	console.log('Disconnected.', params.err.stack)
})

// Ask the connection manager for a ChannelWrapper.  Specify a setup function to
// run every time we reconnect to the broker.
const channelWrapper = connection.createChannel({ json: true })

function logQueue () {
	console.log('queue', channelWrapper.queueLength())
}

let observe = setInterval(logQueue, 1000)

let i = 0
function publish (message) {
	console.log(i++)
	return channelWrapper
		.publish(config.exchange, config.routingKey, message)
		.then(function(keepPublishing) {
			console.log('published')
			if (!keepPublishing) {
				console.error('keepPublishing', keepPublishing)
				generator.pause()
				channel.once('drain', () => generator.resume())
			}
			return keepPublishing
		})
		.catch(function(err) {
			console.error('Message was rejected:', err)
		})
}

generator
	.on('data', (data) => {
		publish(data)
	})
	.on('close', () => {
		console.log('Closing channel')
		logQueue()
		//channelWrapper.close()
		//connection.close()
		//clearInterval(observe)
	})
