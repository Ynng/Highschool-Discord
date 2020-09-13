module.exports = {
	name: 'try',
	description: 'Try me!',
	execute(message, args) {
		message.channel.send('Tried.');
	},
};