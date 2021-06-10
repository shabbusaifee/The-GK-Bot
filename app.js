let ToDoList = `###
To do list:
1) add a store for xp boosters and money boosters
2) add more questions
3) add different kinds of questions like: super questions for more money,
 in 1000 increments, or battle questions to see who can answer fastest

###`
require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
let usersString = fs.readFileSync('./users.json', 'utf-8')
let users = '';
try{
        users = JSON.parse(usersString);
    }
    catch{
        console.log("An error has occurred")
    }
const shuffledAnswerArray = [];
let question;
let choice1, choice2, choice1Number, answer, choiceArray, stringAuthorID;
let authorName, authorAvatarURL, authorID;
let rightAnswerNumber = [];
const Questions = require('./questions.json')
console.log(Questions.length)

let xPmBShopMessageID, mBShopMessageID, shopAuthorID;

let whoAsked = null, askedPeople = [];

let started = false;

let spamNumber = 1;

let prefixJson = require("./prefix.json");
let prefix = prefixJson["default"].prefix;
console.log(prefix)
let messageId = [];

function askCD(id){
    let ourCode = setInterval(()=>{
                    if(users[id].cd.ask > 0){
                    users[id].cd.ask--;
                    fs.writeFile('./users.json', JSON.stringify(users, null, 2), 
                    err=>console.log(err))
                }else{
                    clearInterval(ourCode)
                }
            }, 1000)
}

client.on('message', (message) => {
    usersString = fs.readFileSync('./users.json', 'utf-8')
    try{
        users = JSON.parse(usersString);
    }
    catch{
        console.log("An error has occured, please try again")
    }
    prefixJson = require("./prefix.json");
    prefix = prefixJson["default"].prefix;

    const serverID = ""+ message.guild.id;

    // console.log(users['all-users-id'][0], users[users['all-users-id'][0]])

    if(!prefixJson[serverID]){
        prefixJson[serverID] = {
            prefix: "."
        }

        fs.writeFile('./prefix.json', JSON.stringify(prefixJson, null, 2), err=>{
            if(err) message.channel.send("An error has occured, please try again in a few seconds")
        })
    }else{
        prefix = prefixJson[serverID].prefix;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    for (i=0;i<users['all-users-id'].length;i++){
        let id = users['all-users-id'][i]
        if(users[id].cd.ask > 0){
            askCD(id)
        }
    }

    authorName = message.author.username;
    authorAvatarURL =  message.author.displayAvatarURL();
    let args = message.content.slice(prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();
    args = args.join(" ");
    authorID = message.author.id;
    stringAuthorID = ''+authorID;
    command = command.toLowerCase()

    if (command.toLowerCase() === "start") {
            if(users[stringAuthorID]){
                message.channel.send("You already have a profile" + message.author.toString())
            }else{
                users["all-users-id"].push(authorID)
                users[stringAuthorID] = {
                    id: stringAuthorID,
                    coins : 0,
                    streak: 0,
                    level: 1,
                    reqxp: 25,
                    currentxp: 0,
                    xpBooster: 1,
                    permanentxpbooster: 10,
                    moneyBooster: 1,
                    boostersBought: 1,
                    cd: {
                        ask: 0
                    }
                }
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), err=>{
                    console.log(err)
                })
                message.channel.send("Profile successfully created, check profile using " + 
                prefix+ "profile") 
            }
        }

    console.log(args)

    if(command.toLowerCase() === "leaderboard" || command.toLowerCase() == "ld"){
        // leaderboardMessage = new Discord.MessageEmbed()
    	//         .setColor('#FFD700')
    	//         .setTitle(`Leaderboard`)
    	//         .setAuthor("GK Bot", "https://media1.thehungryjpeg.com/thumbs2/800_3684858_8kg0l3kaq2ziuvpxtlr0jgxusz98lnxn78hg4kpc_gk-monogram-logo-design.jpg")
    	//         .addFields(
    	// 	    { name: "Level", value: `
                    
        //         ` },
        //         {name: "XP", value: `${users[authorID].currentxp}/${
        //             users[authorID].reqxp}`},
        //         {name: "Balance", value: `Coins: ${users[authorID].coins}`},
        //         {name: "Streak", value: `${users[stringAuthorID].streak}`}
        //         )
    	//         .setTimestamp()
    	//         .setFooter(authorName);

        users[authorID].coins += 1;

        message.channel.send("There is not enough people for there to be a leaderboard, but don't worry, invite more people, then a leaderboard will be added")
    }

    if(users[stringAuthorID]){
    if (command.toLowerCase() === "prefix"){
        if(args.length > 0 && args != " "){
            prefixJson[serverID].prefix = ''+args;
            prefix = prefixJson[serverID].prefix;
            fs.writeFile('./prefix.json', JSON.stringify(prefixJson, null, 2), err=>{
                if(err) message.channel.send("An error has occured, please try again in a few seconds")
            })
            message.channel.send("prefix changed to "+prefix)
        }else{
            message.channel.send(`The prefix command requires a prefix arguement, example: ${prefix}prefix .`)
        }
    }

    if(command.toLowerCase() === "profile" || command === "pr" || command === "prof"){
         ProfileMessage = new Discord.MessageEmbed()
    	        .setColor('#FFD700')
    	        .setTitle(`${authorName}'s Profile`)
    	        .setAuthor(authorName, authorAvatarURL)
    	        .addFields(
    		    { name: "Level", value: `${users[authorID].level}` },
                {name: "XP", value: `${users[authorID].currentxp}/${
                    users[authorID].reqxp}`},
                {name: "Balance", value: `Coins: ${users[authorID].coins}`},
                {name: "Streak", value: `${users[stringAuthorID].streak}`}
                )
    	        .setTimestamp()
    	        .setFooter(authorName);
                message.channel.send(ProfileMessage) 
    }

    console.log(`${command}, ${args}`);

    if (command.toLowerCase() === "lets") {
        message.channel.send("Alright Let's go")
    }

    if (command.toLowerCase() === "pingme") {
        // let sentBy = message.author.id;
        // if (sentBy !== "849894042363756565") {
        message.channel.send(message.author.toString())
        // }
    }

    if(command.toLowerCase() === "cooldown" || command === "cd"){
        if(users[stringAuthorID]){
            let ask = users[stringAuthorID].cd.ask
            if(ask !== 0) ask = ask;
            else ask = '✅  ';
            const cooldownMessage = new Discord.MessageEmbed()
    	        .setColor('#FFD700')
    	        .setTitle(`${authorName}'s Cooldowns`)
    	        .setAuthor(authorName, authorAvatarURL)
    	        .addFields(
    		    { name: "Ask", value: `${ask}
                ` }
                )
    	        .setTimestamp()
    	        .setFooter(authorName);
                message.channel.send(cooldownMessage) 
        }else{
            message.channel.send(`Please create a profile using ${prefix}start`)
        }
    }

    if(command.toLowerCase() === 'bal' || command === 'balance' || command === 'b'){
        console.log(users[stringAuthorID])
        
        if(users[stringAuthorID]){
            const balanceMessage = new Discord.MessageEmbed()
    	.setColor('#FFD700')
    	.setTitle(`${authorName}'s Balance`)
    	.setAuthor(authorName, authorAvatarURL)
    	.addFields(
    		{ name: "Coins", value: `${users[stringAuthorID].coins}
            ` }
        )
    	.setTimestamp()
    	.setFooter(authorName);
    console.log('exists')
    message.channel.send(balanceMessage)
    }else{
        console.log('does not exists')
        message.channel.send(`Please create a profile using ${prefix}start`)
        }
        return;
    }

    if(command.toLowerCase() === 'streak' || command === 'st'){
        const streakMessage = new Discord.MessageEmbed()
    	    .setColor('#FFD700')
    	    .setTitle(`${authorName}'s Streak`)
    	    .setAuthor(authorName, authorAvatarURL)
    	    .addFields(
    		    { name: "Streak", value: `${users[stringAuthorID].streak}
                ` }
            )
    	    .setTimestamp()
    	    .setFooter(authorName);
        message.channel.send(streakMessage)
    }

    if (command.toLowerCase() === 'ask' || command === 'a') {
        if(users[stringAuthorID]){
            if(users[stringAuthorID].cd.ask == 0){
                users[stringAuthorID].cd.ask = 10;

                whoAsked = authorID;
                askedPeople.push(whoAsked)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), err=>{
                    if(err)console.log(err);
                })

                askCD(authorID);

                shuffledAnswerArray.push([]);
                questionNumber = Math.floor(Math.random() * Questions.length);
                choice1Number = Math.floor(Math.random() * Questions[questionNumber].choices.length);
                choice2Number = Math.floor(Math.random() * Questions[questionNumber].choices.length);
                while(Questions[questionNumber].choices[choice1Number] == Questions[questionNumber].choices[choice2Number]){
                choice2Number = Math.floor(Math.random() * Questions[questionNumber].choices.length);
                }
                question = Questions[questionNumber].q
                choice1 = Questions[questionNumber].choices[choice1Number];
                choice2 = Questions[questionNumber].choices[choice2Number];
                answer = Questions[questionNumber].rightAnswer;
                choiceArray = [choice1, choice2, answer]
                let copy = choiceArray;

                for(i=0;i<=choiceArray.length;i++){
                    let randomizedNumber = Math.floor(Math.random()*copy.length);
                    shuffledAnswerArray[shuffledAnswerArray.length-1].push(copy[randomizedNumber]);
                    copy.splice(randomizedNumber, 1)
                    if(copy.length == 1){
                        shuffledAnswerArray[shuffledAnswerArray.length-1].push(copy[0])
                    }
                }

                console.log(shuffledAnswerArray);

                for(i=0;i<shuffledAnswerArray[shuffledAnswerArray.length-1].length;i++){
                    if (shuffledAnswerArray[shuffledAnswerArray.length-1][i] == answer){
                        rightAnswerNumber.push(i);
                        console.log(shuffledAnswerArray[shuffledAnswerArray.length-1][i])
                    }else{
                        console.log("Not same")
                    }
                }

                authorName = message.author.username;
                authorAvatarURL =  message.author.displayAvatarURL();

                const questionEmbed = new Discord.MessageEmbed()
    	            .setColor('#0099ff')
    	            .setTitle(`${authorName}'s Question`)
    	            .setAuthor(authorName, authorAvatarURL)
    	            .addFields(
    		            { name: question, value: `
                        1) ${shuffledAnswerArray[shuffledAnswerArray.length-1][0]}\n
                        2) ${shuffledAnswerArray[shuffledAnswerArray.length-1][1]}\n
                        3) ${shuffledAnswerArray[shuffledAnswerArray.length-1][2]}\n
                        ` },
                        {
                            name: "Answering", value: "Good Luck"
                        }
                    )
    	            .setTimestamp()
    	            .setFooter(authorName);

                message.channel.send(questionEmbed)
                .then(message => {
                    messageId.push(message.id);
                    message.react('1️⃣')
                        .then(message.react('2️⃣'))
                        .then(message.react('3️⃣'))
                })
            }else{
                message.channel.send(`Please wait another ${users[stringAuthorID].cd.ask
                } seconds to use this command`)
            }
        }else{
            message.channel.send("Please create a profile using " + prefix +"start")
        }
    }

    if(command.toLowerCase() === "boosters" || command === "bt" || command === "booster" || command === "boost"){
        const boosterMessage = new Discord.MessageEmbed()
    	    .setColor('#ffd700')
    	    .setTitle(``)
    	    .setAuthor(`${authorName}'s Boosters`, authorAvatarURL)
    	    .addFields(
    		    { name: "Money Booster Multiplier", value: users[authorID].moneyBooster + 'x'},
                {name: "XP Booster Multiplier", value: users[authorID].xpBooster + users[authorID].permanentxpbooster + 'x'}
            )
    	    .setTimestamp()
    	    .setFooter(authorName);

        message.channel.send(boosterMessage)
    }

    if(command.toLowerCase() === "shop" || command === "sh"){
        if(args === "Money Booster" || args === "money booster" ||
            args === "Money" || args === "mb" || args === "m"){
            shopAuthorID = message.author.id;
            const shopMessage = new Discord.MessageEmbed()
                .setColor('#ffd700')
                .setTitle(`Shop`)
                .setAuthor("Business Man", 'https://img2.pngio.com/businessman-profession-cartoon-transparent-png-svg-vector-file-cartoon-businessman-png-512_512.png')
                .addFields(
                    { name: "Money Boosters", value: `
                    1) 5x Money Booster (${(10*(3*users[authorID].boostersBought))}k Coins)\n
                    2) 10x Money Booster (${(12*(3*users[authorID].boostersBought))}k Coins)\n
                    3) 15x Money Booster (${(13*(3*users[authorID].boostersBought))}k Coins)\n
                    4) 20x money booster (${(15*(3*users[authorID].boostersBought))}k Coins)\n
                    5) 25x Money Booster (${(18*(3*users[authorID].boostersBought))}k Coins)\n
                    6) 30x Money Booster (${(20*(3*users[authorID].boostersBought))}k Coins)\n
                    7) 40x Money Booster (${(25*(3*users[authorID].boostersBought))}k Coins)\n
                    8) 50x Money Booster (${(28*(3*users[authorID].boostersBought))}k Coins)\n


                    *Money Boosters can be stacked so you can get an infinite number of boosters,
                    but per each booster the price increases by 3 times
                    ` })
                .setTimestamp()
                .setFooter(authorName);

            message.channel.send(shopMessage)
                    .then(message=>{
                        mBShopMessageID = message.id;
                        message.react('1️⃣')
                        setTimeout(()=>message.react('2️⃣'), 10)
                        setTimeout(()=>message.react('3️⃣'), 20)
                        setTimeout(()=>message.react('4️⃣'), 30)
                        setTimeout(()=>message.react('5️⃣'), 40)
                        setTimeout(()=>message.react('6️⃣'), 50)
                        setTimeout(()=>message.react('7️⃣'), 60)
                        setTimeout(()=>message.react('8️⃣'), 70)
                    })
                    .catch(err=>console.log(err))
            }else if(args === "xp booster" || args === "xp" ||
             args === "xb" || args === "xpbooster" || args == "x" || 
             args === "Xp Booster" || args === "XP Booster"){
                shopAuthorID = message.author.id;
                const shopMessage = new Discord.MessageEmbed()
                .setColor('#ffd700')
                .setTitle(`Shop`)
                .setAuthor("Business Man", 'https://img2.pngio.com/businessman-profession-cartoon-transparent-png-svg-vector-file-cartoon-businessman-png-512_512.png')
                .addFields(
                    {name:"XP Boosters", value:`
                    1) 2x XP Booster (10k Coins)\n
                    2) 5x XP Booster (50k Coins)\n
                    3) 10x XP Booster (100k Coins)\n
                    4) 20x XP Booster (200k Coins)\n
                    5) 50x XP Booster (500k Coins)\n
                    6) 100x XP Booster (1M Coins)\n
                    7) 500x XP Booster (5M Coins)\n
                    8) 1000x XP Booster (10M Coins)\n
                    9) 10x Permanent XP Boost (1M Coins)\n


                    *XP Boosters cannot be stacked, except for the PERMANENT one, 
                    but the bought one replaces the current one, so be careful while purchasing,
                    the old higher multiplier might be changed to a newer lower multiplier.
                `})
                .setTimestamp()
                .setFooter(authorName);

            message.channel.send(shopMessage)
                    .then(message=>{
                        xPmBShopMessageID = message.id;
                        message.react('1️⃣')
                        setTimeout(()=>message.react('2️⃣'), 10)
                        setTimeout(()=>message.react('3️⃣'), 20)
                        setTimeout(()=>message.react('4️⃣'), 30)
                        setTimeout(()=>message.react('5️⃣'), 40)
                        setTimeout(()=>message.react('6️⃣'), 50)
                        setTimeout(()=>message.react('7️⃣'), 60)
                        setTimeout(()=>message.react('8️⃣'), 70)
                        setTimeout(()=>message.react('851606169104416811'), 80)
                    })
                    .catch(err=>console.log(err))
            }else if(args.toLowerCase() === "super booster" || args.toLowerCase() === "sb" ||
             args.toLowerCase() === "sb" || args.toLowerCase() === "sbbooster" || args.toLowerCase() == "x" ){
                const shopMessage = new Discord.MessageEmbed()
                    .setColor('#ffd700')
                    .setTitle(`Shop`)
                    .setAuthor("Business Man", 'https://img2.pngio.com/businessman-profession-cartoon-transparent-png-svg-vector-file-cartoon-businessman-png-512_512.png')
                    .addFields(
                        {name:"XP Boosters", value:`
                        1) 2x XP Booster (10k Coins)\n
                        2) 5x XP Booster (50k Coins)\n
                        3) 10x XP Booster (100k Coins)\n
                        4) 20x XP Booster (200k Coins)\n
                        5) 50x XP Booster (500k Coins)\n
                        6) 100x XP Booster (1M Coins)\n
                        7) 500x XP Booster (5M Coins)\n
                        8) 1000x XP Booster (10M Coins)\n
                        9) 10x Permanent XP Boost (1M Coins)\n


                        *XP Boosters cannot be stacked, except for the PERMANENT one, 
                        but the bought one replaces the current one, so be careful while purchasing,
                        the old higher multiplier might be changed to a newer lower multiplier.
                    `})
                    .setTimestamp()
                    .setFooter(authorName);

                message.channel.send(shopMessage)
                .then(message=>{
                    message.react
                })
            }else{
                shopAuthorID = message.author.id;
                const shopMessage = new Discord.MessageEmbed()
                .setColor('#ffd700')
                .setTitle(`Shop`)
                .setAuthor("Business Man", 'https://img2.pngio.com/businessman-profession-cartoon-transparent-png-svg-vector-file-cartoon-businessman-png-512_512.png')
                .addFields(
                    {name:"Shops Available"`
                    1) Money Boosters Shop (${prefix}shop money boosters, or mb)
                    2) XP Boosters Shop (${prefix}shop xp boosters, or xb)
                    3) Super Boosters Shop (${prefix}shop super boosters, or sb)
                `})
                .setTimestamp()
                .setFooter(authorName);

                shopMessage
            }
    }

    if(command.toLowerCase() === "help" || command === 'h'){
        const helpMessage = new Discord.MessageEmbed()
    	.setColor('#0099ff')
    	.setTitle(`All the commands`)
    	.setAuthor(authorName, authorAvatarURL)
    	.addFields(
    		{ name: "Commands", value: `${users[stringAuthorID].money}
            ` }
        )
    	.setTimestamp()
    	.setFooter(authorName);
    }
    }else{
        message.channel.send("Please create an account using " + prefix + "start")
    }
})

client.on('messageReactionAdd', (messageReaction, user) => {
    if (user.bot) return;
    for(i = 0;i<askedPeople.length;i++){
    const { message, emoji } = messageReaction;
    const random = [20,21,22,23,24,25]
    let moneyEarned = Math.round(((75*users[askedPeople[i]].moneyBooster)*Math.round(((users[askedPeople[i]].level)/1.5))+(users[askedPeople[i]].streak * Math.floor(Math.random() * 10))));
    let xpEarned = ((users[askedPeople[i]].level * random[Math.floor(Math.random()*7)]))*(users[authorID].xpBooster + users[authorID].permanentxpbooster);

    if(users[authorID].streak === 100){
        moneyEarned *= 100;
        message.channel.send("Your streak is now 100, so here is a 100 times reward")
    }



    const rightEmbed = new Discord.MessageEmbed()
    	.setColor('00ff00')
    	.setTitle(`${user.username}'s Question`)
    	.setAuthor(user.username, user.displayAvatarURL())
    	.addFields(
    		{ name: question, value: `
            1) ${shuffledAnswerArray[i][0]}\n
            2) ${shuffledAnswerArray[i][1]}\n
            3) ${shuffledAnswerArray[i][2]}\n
            ` },
            {
                name: `Right Answer, You earned ${moneyEarned} Coins`,
                value: `Your Streak has increased, check streak using ${prefix}streak`
            }
        )
    	.setTimestamp()
    	.setFooter(authorName);

    const wrongEmbed = new Discord.MessageEmbed()
    	.setColor('#ff0000')
    	.setTitle(`${authorName}'s Question`)
    	.setAuthor(authorName, authorAvatarURL)
    	.addFields(
    		{ name: question, value: `
            1) ${shuffledAnswerArray[i][0]}\n
            2) ${shuffledAnswerArray[i][1]}\n
            3) ${shuffledAnswerArray[i][2]}\n
            ` },
            {
                name: "Wrong Answer!!!",
                value: "Your streak has ended"
            }
        )
    	.setTimestamp()
    	.setFooter(authorName);

    let options = ["1️⃣","2️⃣","3️⃣" ]

    // console.log(rightAnswerNumber, askedPeople, messageId, user.id, message.id)

    if (emoji.name === options[rightAnswerNumber[i]]) {
        console.log("RightEmoji: ", askedPeople[i], messageId[i], user.id, message.id, user.username)
        if (message.id === messageId[i] && user.id == askedPeople[i]) {
            users[askedPeople[i]].streak++;
            users[askedPeople[i]].coins += moneyEarned;
            users[askedPeople[i]].currentxp += xpEarned;

            while(users[askedPeople[i]].currentxp >= users[askedPeople[i]].reqxp){
                users[askedPeople[i]].level++;
                // console.log([users[askedPeople[i]].currentxp, users[askedPeople[i]].reqxp])
                if(users[askedPeople[i]].currentxp == null){
                    users[askedPeople[i]].currentxp = 0;
                }
                users[askedPeople[i]].currentxp = users[askedPeople[i]].currentxp - users[askedPeople[i]].reqxp;
                message.channel.send(`<@${askedPeople[i]}>, You have leveled up your level is now ${users[askedPeople[i]].level}`)
                // users[whoAsked].currentxp = users[whoAsked].currentxp-users[whoAsked].reqxp;
                users[askedPeople[i]].reqxp = users[askedPeople[i]].level*(users[askedPeople[i]].level*20)
            }

            // messageId.splice(i, 1);
            fs.writeFile('./users.json', JSON.stringify(users, null, 2), err=>{
                if(err)console.log(err);
            })
            message.edit(rightEmbed)
        }
    }
    else if(user.id != askedPeople[i]){
        user.id == user.id;
        // return;
    }else {
        if(message.id === messageId[i]){
            users[askedPeople[i]].streak = 0;
            // messageId.splice(i, 1);
            message.edit(wrongEmbed)
            fs.writeFile('./users.json', JSON.stringify(users, null, 2), err=>{
                if(err)console.log(err);
            })
        }
    }}

})

let yesOrNoMessageId;

client.on("messageReactionAdd", (messageReaction, user)=>{
    if (user.bot) return;
    const { message: message, emoji } = messageReaction;


    // console.log(user.id, emoji.name, mBShopMessageID, message.id)

    if(emoji.name === "1️⃣"){
            let boosterPrice = 10000;
            let boosterMultiplier = 5;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "2️⃣"){
            let boosterPrice = 20000;
            let boosterMultiplier = 10;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "3️⃣"){
            let boosterPrice = 30000;
            let boosterMultiplier = 15;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "4️⃣"){
            let boosterPrice = 40000;
            let boosterMultiplier = 20;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "5️⃣"){
            let boosterPrice = 50000;
            let boosterMultiplier = 25;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "6️⃣"){
            let boosterPrice = 75000;
            let boosterMultiplier = 30;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "7️⃣"){
            let boosterPrice = 85000;
            let boosterMultiplier = 40;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "8️⃣"){
            let boosterPrice = 100000;
            let boosterMultiplier = 50;
        if(message.id === mBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice * (users[authorID].boostersBought*3)){
                setTimeout(()=>mBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].moneyBooster += boosterMultiplier;
                users[authorID].coins = users[authorID].coins - boosterPrice* (users[authorID].boostersBought*3);
                console.log(users[authorID].coins)

                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                
                message.channel.send(`You bought ${boosterMultiplier}x Boost successfully`)

                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice* (users[authorID].boostersBought*3) - users[authorID].coins} more coins`)
        }
        }
    }
})

client.on("messageReactionAdd", (messageReaction, user)=>{
    if (user.bot) return;
    const { message: message, emoji } = messageReaction;


    // console.log(user.id, emoji.name, xPmBShopMessageID, message.id)

    if(emoji.name === "1️⃣"){
            let boosterPrice = 10000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 2;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 2x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "2️⃣"){
            let boosterPrice = 50000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 5;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 5x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "3️⃣"){
            let boosterPrice = 100000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 10;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 10x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "4️⃣"){
            let boosterPrice = 20000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 20;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 20x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "5️⃣"){
            let boosterPrice = 500000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 50;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 50x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "6️⃣"){
            let boosterPrice = 1000000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 100;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 100x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "7️⃣"){
            let boosterPrice = 5000000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 500;
                user[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 500x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.name === "8️⃣"){
            let boosterPrice = 100000000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].xpBooster = 1000;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 1000x Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
    if(emoji.id === "851606169104416811"){
            let boosterPrice = 1000000;
        if(message.id === xPmBShopMessageID && user.id == shopAuthorID){
            if(users[authorID].coins >= boosterPrice){
                setTimeout(()=>xPmBShopMessageID = null, 10000);
                users[authorID].boostersBought += 1;
                users[authorID].permanentxpbooster += 10;
                users[authorID].coins = users[authorID].coins - boosterPrice;
                if(users[authorID].coins < 0){
                    let rightAmount = -users[authorID].coins;
                    users[authorID].coins = rightAmount;
                }
                message.channel.send("You bought 10x Permanent Boost successfully")
                fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err)=>{
                    if(err)console.log(err);
                })
            }else{
            message.channel.send(`You do not have enough coins, You need ${boosterPrice - users[authorID].coins} more coins`)
        }
        }
    }
})

//:thumbsup:

client.once('ready', () => {
    console.log('The bot has started running')
})

//Last Name
client.login(process.env.TOKEN);