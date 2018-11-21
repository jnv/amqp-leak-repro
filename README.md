# Memory Leaks Testing for `amqp-connection-manager`

This is an example of fast messages producer to illustrate performance issues with [amqp-connection-manager](https://github.com/benbria/node-amqp-connection-manager).

## Running

Start local RabbitMQ server or modify [config.js](config.js) to point to a remote one.

Run either [amqplib.js](amqplib.js) or [amqp-conn-manager](amqp-conn-manager.js), preferably with limited memory to see memory leak sooner:

[amqplib](https://github.com/squaremo/amqp.node) implementation:

```
node --max_old_space_size=60 amqplib.js
```

[amqp-connection-manager](https://github.com/benbria/node-amqp-connection-manager) implementation

```
node --max_old_space_size=60 amqp-conn-manager.js
```
