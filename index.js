const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, qachannel, bchannel, QM, sc } = require('./config.json');
const { ADDRCONFIG } = require('dns');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.on('ready', () => {
	console.log('Ready!');
	client.user.setActivity('Quizzing');
});
let qmuid = 0;
// eslint-disable-next-line no-var
var num = 1;
// eslint-disable-next-line no-var
var slides = {};
var scores = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
client.on('message', message => {
	if(message.author.id === qmuid && message.attachments.first()) {
		console.log(message.channel.id);
		const slideurl = message.attachments.first().url;
		var x = '';
		console.log(slideurl);
		for( i = slideurl.length - 1; i >= 0; i--) {
			if(slideurl[i] === '/') {
				break;
			}
			else{
				x = slideurl[i] + x;
			}
		}
		console.log(x);
		slides[x] = slideurl;
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	console.log(message.content);
	if(command === 'ping') {
		const pingembed = new Discord.MessageEmbed()
			.setColor('#00FFFF')
			.setTitle('PONG!')
			.attachFiles('./pong.png')
			.setImage('attachment://pong.png');
		message.channel.send(pingembed);
	}
	else if(command === 'identify' && message.member.roles.cache.some(role => role.name === QM)) {
		qmuid = message.author.id;
		message.channel.send('QM identified');
		message.author.send('You have been identified');
	}
	// else if(command === 'allslides' && message.member.roles.cache.some(role => role.name === QM)) {
	// 	for(i in slides){
	// 		message.channel.send(slides[i]);
	// 	}
	// }
	else if(command === 'god') {
		const godembed = new Discord.MessageEmbed()
			.setColor('#00FFFF')
			.setTitle('Bhaibes is the GOD!')
			.attachFiles('./Bhaibes_is_the_GOD.jpg')
			.setImage('attachment://Bhaibes_is_the_GOD.jpg');
		message.channel.send(godembed);
	}
	else if(command === 'rules') {
		const ruleEmbed = {
			color: 0x00FF00,
			title: 'Rules/Commands',
			fields: [
				{
					name: '.add X',
					value: 'Adds X points to your team',
					inline: false,
				},
				{
					name: '.show',
					value: 'Displays the scoredboard',
					inline: false,
				},
				{
					name: '.reset',
					value: 'Resets the scoredboard',
					inline: false,
				},
				{
					name: '.pounce',
					value: 'Tags all the qms for you, and also messages the bounce answers channel  USE THIS TO INDICATE POUNCES',
					inline: false,
				},
				{
					name: '.nxts',
					value: 'Uploads the next slide and sends it to all team chats',
					inline: false,
				},
				{
					name: '.gtsn X',
					value: 'Goes to slide number X',
					inline: false,
				},
				{
					name: '.gtdel X',
					value: 'Moves ahead by X slides',
					inline: false,
				},
				{
					name: '.there? .ping and .test',
					value: 'Random commands :)',
					inline: false,
				},
				{
					name: '.ptimer X',
					value: 'Sets a timer for X mins',
					inline: false,
				},
				{
					name: '.psc X',
					value: 'QM can use this to score pounces, informs the bounce channel',
					inline: false,
				},
				{
					name: '.send',
					value: 'QM can use this to send an image to all team chats',
					inline: false,
				},
				{
					name: '.who @abc',
					value: 'tells you who abc is',
					inline: false,
				},
				{
					name: '.nxt',
					value: 'note this is different from .nxts, does the same job but you have to dm the bot the images (after it dms you first)'+
						'\n image format: SlideX.jpg if the images have a different format let me know',
					inline: true,
				},
				{
					name: '.identify',
					value: 'use this to make the bot dm you for uploading the slides',
					inline: false,
				},
			],
			timestamp: new Date(),
		};
		message.channel.send({ embed: ruleEmbed });
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
	else if(command === 'test') {
		message.channel.send({ files: ['./test.jpg'] });
	}
	else if(command === 'memlist') {
		// const list = message.guild;
		const ch = message.client.channels.cache.find(channel => channel.name === 'welcome');
		const mm = ch.messages.fetchPinned()
			.then(messages => {
				var ps = ' ';
				const mmap = messages.map(m => m.author);
				const namemap = messages.map(m => m.content);
				for(i = 0; i< messages.size;i++) {
					ps = ps + mmap[i].username + ', ' + namemap[i] + '\n';
				}
				message.channel.send(ps);
			})
			.catch(console.error);
	}
	else if(command === 'who' && args.length > 0) {
		const ch = message.client.channels.cache.find(channel => channel.name === 'welcome');
		const mm = ch.messages.fetchPinned()
			.then(messages => {
				const mmap = messages.map(m => m.author);
				const namemap = messages.map(m => m.content);
				console.log(args[0]);
				// console.log(proarg);
				for(i = 0; i < messages.size;i++) {
					// console.log(mmap[i] + ' ' + namemap[i]);
					let local = '<@!' + mmap[i] + '>';
					if(local === args[0]) {
						message.channel.send(args[0] + ' is ' + namemap[i]);
						break;
					}
					let local1 = '<@' + mmap[i] + '>';
					if(local1 === args[0]) {
						message.channel.send(args[0] + ' is ' + namemap[i]);
						break;
					}
				}
			})
			.catch(console.error);
	}
	// else if(command === 'unknown') {
	// 	const memmap = message.guild.members.cache.map(member => member.user);
	// 	const ch = message.client.channels.cache.find(channel => channel.name === 'welcome');
	// 	const mm = ch.messages.fetchPinned()
	// 		.then(messages => {
	// 			const mmap = messages.map(m => m.author);
	// 			const namemap = messages.map(m => m.content);
	// 			let output = ' ';
	// 			for(let j in memmap) {
	// 				flag = 0;
	// 				for(i = 0; i < messages.size;i++) {
	// 					if( mmap[i].id === memmap[j].id) {
	// 						flag = 1;
	// 						break;
	// 					}
	// 				}
	// 				// console.log(flag);
	// 				if(flag != 1 && memmap[j].bot==false) {
	// 					output += '<@' + memmap[j].id + '>' + '\n';
	// 				}
	// 			}
	// 			message.channel.send('Unknown Handles:\n' + output);
	// 			// message.channel.send('Unknown handles: \n' + output);
	// 		})
	// 		.catch(console.error);

	// }
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
				for(i = 1; i <= 12; i++) {
					const ch = message.client.channels.cache.find(channel => channel.name === 'team-'+i);
					ch.send(nxtsembed);
				}
				num++;
			}
			else {
				message.channel.send('You arent a QM');
			}
		}
		if(command === 'nxt') {
			if(message.member.roles.cache.some(role => role.name === QM)) {
				message.delete();
				const nxtsembed = new Discord.MessageEmbed()
					.setTitle('Uploading Slide ' + num)
					.setColor('#FF0000')
					.setImage(slides['Slide' + num+'.jpeg']);
				message.channel.send(nxtsembed);
				// message.channel.send(slides['Slide1.JPG'])
				for(i = 1; i <= 12; i++) {
					const ch = message.client.channels.cache.find(channel => channel.name === 'team-'+i);
					ch.send(nxtsembed);
				}
				num++;
			}
			else {
				message.channel.send('You arent a QM');
			}
		}
		else if(command === 'send') {
			if(message.member.roles.cache.some(role => role.name === QM) && message.attachments.size>0) {
				console.log(message.attachments);
				for(i = 1; i <= 12; i++) {
					const ch = message.client.channels.cache.find(channel => channel.name === 'team-'+i);
					ch.send(message.attachments.first().url);
				}
			}
			else {
				message.delete();
				message.channel.send('Either you arent a QM or you didnt upload an image');
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
		else if(command === 'ptimer' && args.length > 0) {
			message.delete();
			const ch = message.client.channels.cache.find(channel => channel.name === bchannel);
			const pouncetimerEmbed = new Discord.MessageEmbed()
				.setColor('#424242')
				.setTitle('Pounce window open for ' + args[0] + 'mins')
				.setTimestamp(new Date());
			ch.send(pouncetimerEmbed);
			setTimeout(function() {
				const pouncendEmbed = new Discord.MessageEmbed()
					.setColor('#424242')
					.setTitle('Pounce window is closed')
					.setTimestamp(new Date());
				ch.send(pouncendEmbed);
			}, parseFloat(args[0]) * 60000);
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
				// console.log(parseFloat(args[0]));
				if(parseFloat(args[0])) {
					message.channel.send(`adding ${args[0]} to team number ${idx}`);

					scores[idx - 1] += parseFloat(args[0]);
				}
			}
		}

		else if(command === 'show') {
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
		else if(command === 'reset') {
			for(let i in scores) {
				scores[i] = 0;
			}
			message.channel.send('Reset done');
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
		const qmmap = message.guild.roles.cache.get('ROLE ID OF QM').members.map(m => m.user);
		// eslint-disable-next-line no-var
		var ps = ' ';
		// eslint-disable-next-line no-var
		for(var i in qmmap) {
			ps += qmmap[i].toString() + ' ';
		}
		message.channel.send(ps);
	}
	else if(command === 'psc' && args.length > 0) {
		if(message.member.roles.cache.some(role => role.name === QM)) {
			const ch = message.client.channels.cache.find(channel => channel.name === bchannel);
			idx = -1;
			if(message.channel.name === 'team-1') {
				idx = 1;
			}
			else if(message.channel.name === 'team-2') {
				idx = 2;
			}
			else if(message.channel.name === 'team-3') {
				idx = 3;
			}
			else if(message.channel.name === 'team-4') {
				idx = 4;
			}
			else if(message.channel.name === 'team-5') {
				idx = 5;
			}
			else if(message.channel.name === 'team-6') {
				idx = 6;
			}
			else if(message.channel.name === 'team-7') {
				idx = 7;
			}
			else if(message.channel.name === 'team-8') {
				idx = 8;
			}
			else if(message.channel.name === 'team-9') {
				idx = 9;
			}
			else if(message.channel.name === 'team-10') {
				idx = 10;
			}
			else if(message.channel.name === 'team-11') {
				idx = 11;
			}
			else if(message.channel.name === 'team-12') {
				idx = 12;
			}
			if(idx != -1) {
				if(parseFloat(args[0])) {
					message.channel.send(`adding ${args[0]} to team number ${idx} on pounce`);
					ch.send(`adding ${args[0]} to team number ${idx}  on pounce`);
					scores[idx - 1] += parseFloat(args[0]);
				}
			}
		}
		else {
			message.channel.send('You arent a QM');
		}
	}
});


client.login(token);