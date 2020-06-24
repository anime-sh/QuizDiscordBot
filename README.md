# QuizDiscordBot
A simple discord bot to make quizzing on discord easy

A very simple hastily written (dont judge the code plis :/) discord bot which has 3 features.

The bot makes it easy to upload slides from a PPT, if you have it exported as .jpg images. 
Store the images in a folder called uploads in the root folder of your bot.
The command .nxts (next slide) will upload the next slide, you can use the command .gtsn X ( go to slide number ) to go to slide number X.
.nxts and .gtsn work only if the sender is in the channel set to as qachannel in the config.json file and has the role 'QM'

Scoring is fairly simple with this bot, .add X adds X number of points and .show displays the scoreboard.
Scoring commands only work in the channel set to as bchannel in the config.json file.
The bot ascertains the team to add points into using the role of the sender, for eg if a user with the role Team 4 sends the command .add 15, the bot would add 15 points into team 4.

The .pounce command alerts the QM about the pounce of a certain team. It does so by using the channel names.
For example if a user types .pounce @PERSON_WITH_QM_ROLE, in a channel named Team 5 the bot would DM the tagged person with the message " Teamm 5 has pounced"

The entire bot works using roles, set them as per your requirement by editting the index.js file.
You can set the prefix for commands, bot token and channel names by changing the config.json file
