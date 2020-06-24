const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');

// require the config file
const { prefix, token, qachannel, bchannel, QM, sc } = require('./config.json');
const { ADDRCONFIG } = require('dns');

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
var scores = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	console.log(message.content);
	// message.channel.send('In channel ' + message.channel.name);
	if(command === 'ping') {
		const pingembed = new Discord.MessageEmbed()
			.setColor('#00FFFF')
			.setTitle('PONG!')
			.attachFiles('./pong.png')
			.setImage('attachment://pong.png');
		message.channel.send(pingembed);
	}
	else if(command === 'there?') {
		const pingembed = new Discord.MessageEmbed()
			.setColor('#00FFFF')
			.setTitle('HENLO FRENS!')
			.attachFiles('./frens.jpg')
			.setImage('attachment://frens.jpg');
		message.channel.send(pingembed);
	}
	else if(message.channel.name === 'general') {
		if(command === 'pounce') {
			message.channel.send('Don\'t pounce here');
		}
	}
	else if(message.channel.name === qachannel) {
		if(command === 'nxts') {
			if(message.member.roles.cache.some(role => role.name === QM)) {
				message.delete();
				const nxtsembed = new Discord.MessageEmbed()
					.setTitle('Uploading Slide ' + num)
					.setColor('#FF0000')
					.attachFiles('./upload/Slide' + num + '.jpg')
					.setImage('attachment://' + 'Slide' + num + '.jpg');
				message.channel.send(nxtsembed);
				num++;
			}
			else {
				message.channel.send('You arent a QM');
			}
		}
		else if(command === 'gtsn' && args.length > 0) {
			message.delete();
			num = parseInt(args[0]);
			message.channel.send('Now on slide number ' + num);
		}
		else if(command === 'gtdel' && args.length > 0) {
			num += parseInt(args[0]);
			message.channel.send('Now on slide number ' + num);
		}
		else if(command === 'pounce') {
			message.channel.send('Don\'t pounce here');
		}
	}

	else if(message.channel.name === bchannel) {

		if(command === 'add' && args.length > 0) {
			// eslint-disable-next-line no-var
			var idx = -1;

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
			else if(message.member.roles.cache.some(role => role.name === 'Team 9')) {
				idx = 9;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 10')) {
				idx = 10;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 11')) {
				idx = 11;
			}
			else if(message.member.roles.cache.some(role => role.name === 'Team 12')) {
				idx = 12;
			}
			if(idx != -1) {
				message.channel.send(`adding ${args[0]} to team number ${idx}`);
				scores[idx - 1] += parseFloat(args[0]);
			}
		}

		else if(command === 'show') {
			// eslint-disable-next-line no-var
			// message.channel.send(`Team 1: ${scores[0]}\nTeam 2: ${scores[1]}\nTeam 3: ${scores[2]}\nTeam 4: ${scores[3]}\nTeam 5: ${scores[4]}\nTeam 6: ${scores[5]}\nTeam 7: ${scores[6]}\nTeam 8: ${scores[7]}\n`);
			const scoreboardEmbed = {
				color: 0x00FF00,
				title: 'Score Board',
				fields: [
					{
						name: 'Team 1: ',
						value: `${scores[0]}`,
						inline: sc,
					},
					{
						name: 'Team 2: ',
						value: `${scores[1]}`,
						inline: sc,
					},
					{
						name: 'Team 3: ',
						value: `${scores[2]}`,
						inline: sc,
					},
					{
						name: 'Team 4: ',
						value: `${scores[3]}`,
						inline: sc,
					},
					{
						name: 'Team 5: ',
						value: `${scores[4]}`,
						inline: sc,
					},
					{
						name: 'Team 6: ',
						value: `${scores[5]}`,
						inline: sc,
					},
					{
						name: 'Team 7: ',
						value: `${scores[6]}`,
						inline: sc,
					},
					{
						name: 'Team 8: ',
						value: `${scores[7]}`,
						inline: sc,
					},
					{
						name: 'Team 9: ',
						value: `${scores[8]}`,
						inline: sc,
					},
					{
						name: 'Team 10: ',
						value: `${scores[9]}`,
						inline: sc,
					},
					{
						name: 'Team 11: ',
						value: `${scores[10]}`,
						inline: sc,
					},
					{
						name: 'Team 12: ',
						value: `${scores[11]}`,
						inline: sc,
					},
				],
				timestamp: new 	Date(),
			};
			message.channel.send({ embed: scoreboardEmbed });
		}
		else if(command === 'pounce') {
			message.channel.send('Don\'t pounce here');
		}
	}

	else if(command === 'pounce') {
		const ch = message.client.channels.cache.find(channel => channel.name === bchannel);
		const pounceEmbed = new Discord.MessageEmbed()
			.setColor('#424242')
			.setTitle(message.channel.name + ' has pounced')
			.setTimestamp(new Date());
		ch.send(pounceEmbed);
		const pounclocal = new Discord.MessageEmbed ()
			.setColor('#123452')
			.setTitle('Theres a pounce here');
		message.channel.send(pounclocal);
		message.channel.send(message.guild.roles.cache.get('690122704107470901').members.first().user.toString());
		// const mention = args[0].mentions;
		// if(mention == null) {
		// 	return;
		// }
		// if(mention.roles.first().name != QM) {
		// 	message.channel.send('Tagged role is not QM');
		// }
	}
});

// login to Discord with your app's token
client.login(token);