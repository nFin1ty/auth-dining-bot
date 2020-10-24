const Discord = require('discord.js');
const fetch = require('node-fetch')
const TurndownService = require('turndown')

const client = new Discord.Client();

var turndownService = new TurndownService()
turndownService.addRule('p', {
  filter: ['p'],
  replacement: function (content) {
    return '\n' + content
  }
})

client.on('ready', () => {
  console.log('I am ready!');


client.on('message', message => {
	
	if (message.content.toLowerCase() === '!lesxi') {
		
		var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		var date = new Date();
		var dayField = "field_club_menu_" + days[date.getDay()]
		let url = "https://www.auth.gr/phone_services/node/3280";
		let settings = { method: "Get" };
 
		fetch(url, settings)
			.then(res => res.json())
			.then((json) => {
				menu = (json[dayField]["und"][0]["safe_value"]);
		 
				// Remove unwanted and inconsistent HTML elements
				menu = menu.replace(/<hr \/>/gm, '');
				menu = menu.replace(/<h3>/gm, '');
				menu = menu.replace(/<div>/gm, '');
		 
				var menumd = turndownService.turndown(menu);
				message.channel.send(menumd);
			});
        
    }