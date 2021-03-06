const commando = require('discord.js-commando');

class addTempRoleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'addtemprole',
	    guildOnly: true,
            group: 'random',
            memberName: 'temprole',
			description: 'Add temporary role to user!.Default is 7 days.',
			examples: ['addinsurance @Crawl#3208 7', 'addinsurance Crawl'],
			args: [
				{
					key: 'member',
					label: 'user',
					prompt: 'What user would you like to add insurance to?',
					type: 'member'
				},
				{
				  key: 'role',
				  label: 'role',
				  prompt: 'the role to temporary add',
				  type: 'role'
				  //default: 7
				}
	   			,{
				  key: 'days',
				  prompt: 'how many days should it last?',
				  type: 'integer',
				  default: 7
				}
			],		
        });
    }
	
	
    async run(msg, args) {
	const role = args.role;
        const member = args.member;
    	var amount= args.days;
	if(!role.id || !member.id){return;}
	if(msg.member.hasPermission('MANAGE_ROLES') && msg.member.hasPermission('BAN_MEMBERS')){
          if(member.roles.has(role.id)){
		return msg.reply("User already has ${role.name} insurance!");
	  }
	if(amount > 30){amount=30;}
	
	var new_date = new Date();
	new_date.setDate(new_date.getDate() + amount);
	new_date = new_date.toISOString().substring(0, 10);
	var today = new Date(); today = today.toISOString().substring(0, 10);
	var pg = require("pg");
	var client = new pg.Client(process.env.DATABASE_URL);
        client.connect();
        console.log("Connected to Mysql");
        client.query('INSERT INTO insurance(userid,roleid,removeAtDate,createdAtDate,added_byid) VALUES($1,$2,$3,$4,$5) ON CONFLICT(userid,roleid) DO UPDATE SET removeAtDate=$3,createdAtDate=$4,added_byid=$5 ', [member.id,role.id,new_date,today,msg.author.id], function (err, result) {
            if (err) {
                console.error(err);
            }
            else{
		    console.log(result);
		    member.addRole(role.id,"Insurance for "+amount+" days");
		    msg.reply("You've added the insurance to $1",member.username);
		    console.log("end");
		    client.end();
	    }
        });	
	}else{ return msg.reply("You don't have the right permissions[BAN,MANAGE ROLES]");}
    }
}

module.exports = addTempRoleCommand;
