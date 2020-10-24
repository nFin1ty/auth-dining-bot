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
		 
				var menumd = turndownService.turndown(menu);
				
				menumd = "**Μενού " + days_el[date.getDay()] + ":**\n\n" + menumd;
				
				// Fix for 'Μεσημεριανό', 'Βραδινό' labels not on newline
				menumd = menumd.replace(/(\S)(\*\*Μεσημεριανό)/g, "$1\n\n$2");
				menumd = menumd.replace(/(\S)(\*\*Βραδινό)/g, "$1\n\n$2");
				
				// Add underlining for 'Πρωινό', 'Μεσημεριανό', 'Βραδινό' labels
				menumd = menumd.replace(/(\*\*(Πρωινό|Μεσημεριανό|Βραδινό)\*\*)/g, "__$1__");
			
				message.channel.send(menumd);
			});
        
    }
	
client.login("your-bot-token-here");