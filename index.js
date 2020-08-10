const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, qachannel, bchannel, QM, sc } = require('./config.json');
const { ADDRCONFIG } = require('dns');
const { join } = require('path');
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
var teams = [];
var scores = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
let join_flag = 1;
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
	else if(command === 'join' && args.length > 0) {
		if(join_flag === 1) {
			message.delete();
			const role1 = message.guild.roles.cache.find(role => role.name === 'Team ' + args[0]);
			const person = message.guild.member(message.author);
			for(let i = 1;i <= 12 ; i++) {
				if(person.roles.cache.some(role => role.name === 'Team ' + i)) {
					const temp = message.guild.roles.cache.find(role => role.name === 'Team ' + i);
					person.roles.remove(temp).catch(console.error);
				}
			}
			person.roles.add(role1).catch(console.error);
			message.channel.send('added ' + message.author.username + ' to team number ' + args[0]);
		}
		else{
			message.delete();
			message.channel.send('Teams frozen');
		}
	}
	// for testing
	// else if(command === 'purge' && args.length > 0) {
	// 	message.channel.bulkDelete(1 + parseInt(args[0])).catch(console.error);
	// }

	else if(command === 'reax' && args.length > 0) {
		message.channel.messages.fetch(args[0])
			.then( message => {
				const reaxmap = message.reactions.cache.array();
				for(let i in reaxmap) {
					if(reaxmap[i]._emoji.id) {
						const emoji = message.guild.emojis.cache.get(reaxmap[i]._emoji.id);
						reaxmap[i].users.fetch()
							.then(users => {
								const reaxlist = users.map(user => user.username);
								message.channel.send(`People who reacted ${emoji} : ` + reaxlist.toString());
							})
							.catch(console.error);
					}
					else {
						reaxmap[i].users.fetch()
							.then(users => {
								const reaxlist = users.map(user => user.username);
								message.channel.send('People who reacted ' + reaxmap[i]._emoji.name + ' : ' + reaxlist.toString());
							})
							.catch(console.error);
					}
					// console.log(reaxmap[i]);
				}
			})
			.catch(console.error);
	}
	else if(command === 'teamup' && args.length > 1) {
		if(message.member.roles.cache.some(role => role.name === QM) || message.member.roles.cache.some(role => role.name === 'mods')) {
			;
		}
		else {
			message.channel.send('Not authorised');
			return ;
		}
		console.log('hi');
		teams = [];
		for( let i = 0 ; i < parseInt(args[1]); i++) {
			teams.push('');
		}
		let thumb = [];
		let ques = [];
		message.channel.messages.fetch(args[0])
			.then(message => {
				const reaxmap = message.reactions.cache.array();
				for(let i in reaxmap) {
					if(reaxmap[i]._emoji.name === '👍') {
						reaxmap[i].users.fetch()
							.then(users => {
								const reaxlist = users.map(user => user.username);
								for(let z in reaxlist) {
									thumb.push(reaxlist[z]);
								}
								shuffle(thumb);
								console.log(thumb);
								for(let z = 0; z < reaxlist.length; z++) {
									teams[z % args[1]] = teams[z % args[1]] + ', ' + thumb[z];
								}
								console.log(teams);
							})
							.catch(console.error);
					}
					else if(reaxmap[i]._emoji.name === '❔') {
						reaxmap[i].users.fetch()
							.then(users => {
								const reaxlist = users.map(user => user.username);
								for(let z in reaxlist) {
									ques.push(reaxlist[z]);
								}
								shuffle(ques);
								console.log(ques);
								for(let z = reaxlist.length - 1; z >= 0; z--) {
									teams[z % args[1]] = teams[z % args[1]] + ', ' + ques[z];
								}
								console.log(teams);
							})
							.catch(console.error);
					}
				}
			})
			.catch(console.error);
	}
	else if(command === 'showteams') {
		let out = ' ,\n';
		for(i = 1 ; i <= teams.length; i++) {
			out += `Team ${i}:` + teams[i - 1] + '\n';
		}
		message.channel.send(out);
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
	else if(command === 'rules' || command === 'help') {
		message.delete();
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
					name: '.pounce or .p',
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
				{
					name: '.join X',
					value: 'join team X',
					inline: false,
				},
				{
					name: '.remove_team_roles',
					value: 'removes the team roles from all server members, can only be called by the qm',
					inline: false,
				},
				{
					name: '.start_join',
					value: 'QM needs to use this command to allow .join to work',
					inline: false,
				},
				{
					name: 'freeze_teams',
					value: 'QM can use this to stop .join commands',
					inline: false,
				},
				{
					name: '.reax message_id',
					value: 'gives the list of users who reacted on a message',
					inline: false,
				},
				{
					name: '.teamup message_id number_of_teams',
					value: 'distributes people who reacted with 👍 and ❔ randomly into teams, can be used by qm and mods',
					inline: false,
				},
				{
					name: '.showteams',
					value: 'displays the teams allocated, use it after .teamup, does NOT show people who have Team roles',
					inline: false,
				},
				{
					name: '.rules or .help',
					value: 'displays this list',
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
		// if(command === 'nxts') {
		// 	if(message.member.roles.cache.some(role => role.name === QM)) {
		// 		message.delete();
		// 		const nxtsembed = new Discord.MessageEmbed()
		// 			.setTitle('Uploading Slide ' + num)
		// 			.setColor('#FF0000')
		// 			.attachFiles('./upload/Slide' + num + '.jpg')
		// 			.setImage('attachment://' + 'Slide' + num + '.jpg');
		// 		message.channel.send(nxtsembed);
		// 		for(i = 1; i <= 12; i++) {
		// 			const ch = message.client.channels.cache.find(channel => channel.name === 'team-'+i);
		// 			ch.send(nxtsembed);
		// 		}
		// 		num++;
		// 	}
		// 	else {
		// 		message.channel.send('You arent a QM');
		// 	}
		// }
		if(command === 'nxt') {
			if(message.member.roles.cache.some(role => role.name === QM)) {
				message.delete();
				const nxtsembed = new Discord.MessageEmbed()
					.setTitle('Uploading Slide ' + num)
					.setColor('#FF0000')
					.setImage(slides['Slide' + num + '.jpg']);
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
		else if(command === 'start_join') {
			message.delete();
			message.channel.send('People can now join teams');
			join_flag = 1;
		}
		else if(command === 'freeze_teams') {
			message.delete();
			message.channel.send('Teams frozen');
			join_flag = 0;
		}
		else if(command === 'remove_team_roles') {
			const memmap = message.guild.members.cache.map(member => member);
			for(let j in memmap) {
				for(let i = 1 ; i <= 12 ; i++) {
					if(memmap[j].roles.cache.some(role => role.name === 'Team ' + i)) {
						const temp = message.guild.roles.cache.find(role => role.name === 'Team ' + i);
						memmap[j].roles.remove(temp).catch(console.error);
					}
				}
			}
			message.channel.send('Removed all teams');
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

	else if(command === 'pounce' || command === 'p') {
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
		const qmmap = message.guild.roles.cache.get('690122704107470901').members.map(m => m.user);
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