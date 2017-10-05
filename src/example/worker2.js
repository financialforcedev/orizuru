'use strict';

const
	root = require('app-root-path'),
	{ Handler } = require(root + '/src/lib/index'),

	// get the transport
	transport = require('@financialforcedev/nozomi-transport-rabbitmq'),

	// configure the transport
	transportConfig = {
		cloudamqpUrl: 'amqp://localhost'
	},

	// get schemas
	eventName = '/api/ageAndDob',

	// create a simple callback
	callback = ({ message, context }) => {
		// eslint-disable-next-line no-console
		console.log('worker 2');
		// eslint-disable-next-line no-console
		console.log(message);
		// eslint-disable-next-line no-console
		console.log(context);
	};

// wire handler
new Handler({ transport, transportConfig }).handle({ eventName, callback });
