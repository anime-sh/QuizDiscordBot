# QuizDiscordBot
A simple discord bot to make quizzing on discord easy.

## Features 
A very simple hastily written (dont judge the code plis :/) discord bot which has ~~3~~ many features.

### About questions and slides
The bot makes it easy to upload slides from a PPT, if you have it exported as .jpg images. 
Store the images in a folder called uploads in the root folder of your bot.
The command .nxts (next slide) will upload the next slide.

Alternatively the Quiz Master can use .identify after which the bot will dm the qm, after which the qm can bulk upload the slides exported as images.
Take care of the image extension. The command for uploading slides via this method is .nxt .

You can use the command .gtsn X ( go to slide number ) to go to slide number X.
Command .gtdel X will result in the bot moving forward by X slides.
.nxts .gtdel and .gtsn work only if the sender is in the channel set to as qachannel in the config.json file and has the role 'QM'

### Scoring 
Scoring with this bot is very easy and jargon free.
.add X adds X number of points 
.show displays the scoreboard
.reset resets the scoreboard
Scoring commands only work in the channel set to as bchannel in the config.json file.
The bot ascertains the team to add points into using the role of the sender, 
For example if a user with the role 'Team 4' sends the command .add 15, the bot would add 15 points into team 4.

### Pouncing 
Pouncing is also easy with this bot.
.pounce does two things, it tags all the people with role set to QM and it also notifies the bounce answers channel of your teams pounce
.p can also be used for pouncing.
.psc can be used by the QM to score pounces in the team channel, the bot will notify the bounce channel of the same. 
.ptimer X sets a timer of X minutes ( X can be a floating point number), this can be used by the QM in the question_answers channel
.rules and .help display all the commands this bot has.

### Random
.ping .there? and .test are fun commands used to test if the bot is online.
Images used in these three commands have to be stored in the root folder of the bot.
.who @abc tells you who that person is, you need to pin messages in the welcome channel
.memlist gives the list of all members of the server

### Team formation
.reax message_id gives the list of people who reacted on that particular message
.teamup message_id no_of_teams , randomly distributes people who reacted with certain emojis (:thumbsup: and :grey_question:) on the particular message into teams.
.join X can be used by people to join team X (adds the role of 'Team X' )
.remove_all_teams can be used by the qm to remove everyone from their teams
.freeze_teams can be used by the qm to freeze .join 

### Help
.rules or .help


## How to use it in your own server?

Okay so this is a very simple project and the way it has been designed means that it can function properly only if it is in one server at a time.
So if you have a quizzing server and like the idea of having a bot which does all this, you could create your own bot (install node.js and discord.js generate bot token, set bot permissions and invite the bot to the server), copy this code and make relevant changes in the config.json and index,js files, your package.json file would be system generated anyway so dont copy that.

In the config.json file set the names for the question answer channel, the bounce channel (channel where scoring takes place) and the name of the qm role.
You can also change the prefix of the commands, in this projects it is '.', by editing the prefix field in the config.json file.

In index.js you'll have to change the address of the images uploaded.

You will also have to make sure your team roles match this format -> "Team X" (case sensitive, without quotes), if it doesnt the scoring features wont work.
Do the same for Team text channels, **make sure the text channels and voice channels dont have the same name**
In order to tag the qms, the bot needs to know the roleid, insert the role id in the following line in index.js (around line number 264)
        const qmmap = message.guild.roles.cache.get('ROLE ID OF QM').members.map(m => m.user);


Make sure the bot has permissions to read and send messages in all relevant channels (questions_answers, bounce_answers and the team channels)

**DO NOT USE THE SAME BOT WITH THE SAME TOKEN IN MORE THAN ONE SERVER**
