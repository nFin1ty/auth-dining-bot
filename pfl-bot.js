const Discord = require('discord.js');
const axios = require('axios');
const TurndownService = require('turndown')
const cheerio = require('cheerio')

const { Client, Intents } = require('discord.js');
const myIntents = new Intents(14077);
const client = new Client({ intents: myIntents });

var turndownService = new TurndownService()
		
		turndownService
			.addRule('paragraph', {
				filter: ['p', 'hr'],
				replacement: (content) => '\n' + content,
			})
			.addRule('bullet list', {
			  filter: ['li'],
			  replacement: (content) => '\n•' + content,
			})
			.addRule('rm-headers', {
			  filter: ['h3', 'h4'],
			  replacement: () => ''
			})

client.on('messageCreate', message => {
	
	if (message.content.toLowerCase() === '!lesxi') {
		
		var date = new Date();
		today = date.getDay();
		
		// Sunday's menu ID is 7
		if (today == 0) {
			today = 7;
		}
		panetarget = ".kt-accordion-pane-" + today;

		( async () => {
		  const result = await axios.get('https://www.auth.gr/weekly-menu/');
		  const $ = cheerio.load(result.data);
		  var menumd = turndownService.turndown($(panetarget).html());
		  message.channel.send(menumd);
		})();
        
	}
	
client.login("your-bot-token-here");
