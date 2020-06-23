const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');

// require the config file
const { prefix, token, qachannel, bchannel } = require('./config.json');

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});
// eslint-disable-next-line no-var
var num = 1;
// eslint-disable-next-line no-var
var scores = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	console.log(message.content);
	// message.channel.send('In channel ' + message.channel.name);
	if(command === 'ping') {
		message.channel.send('pong');
	}
	else if(command === 'there?') {
		message.channel.send('Henlo frens');
	}
	else if(message.channel.name === qachannel) {
		if(command === 'nxts') {
			if(message.member.roles.cache.some(role => role.name === 'QM')) {
				message.channel.send('Uploading Slide ' + num);
				message.channel.send({ files: ['./upload/Slide' + num + '.jpg'] });
				num++;
			}
			else {
				message.channel.send('You arent a QM');
			}
		}
		else if(command === 'gtsn') {
			num = parseInt(args[0]);
			message.channel.send('Now on slide number ' + num);
		}
	}

	else if(message.channel.name === bchannel) {

		if(command === 'add') {
			// eslint-disable-next-line no-var
			var idx;

			if(message.member.roles.cache.some(role => role.name === 'Team 1')) {
				idx = 1;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 2')) {
				idx = 2;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 3')) {
				idx = 3;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 4')) {
				idx = 4;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 5')) {
				idx = 5;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 6')) {
				idx = 6;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 7')) {
				idx = 7;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 8')) {
				idx = 8;
			}

			message.channel.send(`adding ${args[0]} to team number ${idx}`);
			scores[idx - 1] += parseFloat(args[0]);
		}

		else if(command === 'show') {
			// eslint-disable-next-line no-var
			var i;
			for(i = 1;i <= 8;i++) {
				message.channel.send('Team ' + i + ' : ' + scores[i - 1]);
			}
		}
	}

	else if(command === 'pounce') {
		const mention = message.mentions.members.first();
		if(mention === null) return;
		if(mention.roles.cache.some(role => role.name === 'QM')) {
			mention.send(message.channel.name + ' has pounced');
		}
		else{
			message.channel.send('Tagged user is not a QM');
		}
	}
});

// login to Discord with your app's token
client.login(token);