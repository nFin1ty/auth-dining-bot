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
		var days_el = ['Κυριακής', 'Δευτέρας', 'Τρίτης', 'Τετάρτης', 'Πέμπτης', 'Παρασκευής', 'Σαββάτου'];
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
				menu = menu.replace(/\t/gm, '');	
				menu = menu.replace(/ /gm, '');	//nbsp characters

		 
				var menumd = turndownService.turndown(menu);

				// Fix for 'Μεσημεριανό', 'Βραδινό' labels not on newline
				menumd = menumd.replace(/(\S)(\*\*Μεσημεριανό)/g, "$1\n\n$2");
				menumd = menumd.replace(/(\S)(\*\*Βραδινό)/g, "$1\n\n$2");
				
				//Break menu to embed fields
				var regexp = /\n([^\*\*]*)/g;
				var match = regexp.exec(menumd);
				
				var fields = [];
				
				while (match != null) {
					if (/\S/g.test(match[1])) {
						field = match[1].replace(/\n\n/gm, '');
						fields.push(field);
					}
					match = regexp.exec(menumd);
				}			
				
				const menuEmbed = new Discord.RichEmbed()
					.setColor(0xff0080)
					.setTitle('Μενoύ ' + days_el[date.getDay()])
					.setURL('https://www.auth.gr/units/596/weekly-menu')
					.addField('Πρωινό', fields[0])
					.addBlankField()
					.addField('Μεσημεριανό - 1η επιλογή', fields[1], true)
					.addField('Μεσημεριανό - 2η επιλογή', fields[2], true)
					.addBlankField()
					.addField('Βραδινό - 1η επιλογή', fields[3], true)
					.addField('Βραδινό - 2η επιλογή', fields[4], true)
				
				message.channel.send(menuEmbed);
			});
        
	}
	
client.login("your-bot-token-here");
