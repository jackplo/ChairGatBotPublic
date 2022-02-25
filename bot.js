const { Client, Intents, Collection } = require('discord.js');
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({ intents: myIntents });
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const { string } = require('zod');


client.on('ready', () => {
    console.log("Online");
});

client.on('message', async (message) => {
    //advice API and command
    if (message.content.startsWith('--advice')) {
        try {
            const { data } = await axios.get('https://api.adviceslip.com/advice');

            const {
                slip: {
                    advice,
                }
            } = data;
            
            return message.reply(`${advice}`);
        } catch(err) {
           return message.reply('Error, try again');
        }
    }

    if (message.content.startsWith('--giphy')) {

        const api_key = process.env.GIPHY_TOKEN;
        const [command, ...args] = message.content.split(' ');
        if (args.length !== 1) {
            message.reply('Enter valid parameters. Ex.) --giphy burrito');
        } else {
            const tag = args;
            try {
                const content = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${api_key}&tag=${tag}&rating=pg`);
                
                const {
                    data: {
                        data: {
                            url,
                        }
                    }
                } = content;
                    
                return message.reply(url);

            } catch(err) {
                return message.reply("Something went wrong try again");
            }
        }    
    }    
});

client.on('message', async(message) => {
    if (message.content.startsWith('--news')) {
        const api_key = process.env.NEWS_TOKEN;
        const [command, ...args] = message.content.split(' ');
        if (args.length < 1) {
            message.reply('Enter atleast one valid paramter');
        } else {
            const keywords = args;
            try {
                const content = await axios.get(`https://newsapi.org/v2/everything?q=${keywords}&apiKey=${api_key}`);
                console.log(content);
                
                const {
                    data: {
                        articles: [
                            {
                                author,
                                title,
                                url,
                            }
                        ]
                    }
                } = content 

                return message.reply(`Latest news with keywords: ${keywords}\nAuthor: ${author}\nTitle: ${title}\nURL: ${url}`);
            } catch(err) {
                return message.reply("Error");
            }
        }
    }
})


client.login(process.env.DISCORDJS_BOT_TOKEN);