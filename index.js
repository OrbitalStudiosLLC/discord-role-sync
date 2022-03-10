const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const config = require('./config.json');
const cron = require('node-cron');
require('dotenv').config()

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await syncRoles();
});

client.on('guildMemberAdd', async member => {
    await progressiveSearch(member.id);
});

cron.schedule(config.cron_time, () => {
    syncRoles();
});

async function progressiveSearch(member_id) {
    try {
        for(i = 0; i < config.roles.length; i++){
            let base_guild = client.guilds.cache.get(config.roles[i].base_guild);
            let base_member = base_guild.members.cache.find(member => member.id === member_id);
            if (base_member) {
                let target_guild = client.guilds.cache.get(config.roles[i].extending_guild);
                let target_role = target_guild.roles.cache.find(role => role.id === config.roles[i].extending_role_id);
                let target_member = target_guild.members.cache.find(member => member.id === member_id);
                if (target_member && base_member.roles.cache.has(target_role.id)) {
                    target_member.roles.add(target_role);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function syncRoles() {
    try {
        for(i = 0; i < config.roles.length; i++){
            let base_guild = client.guilds.cache.get(config.roles[i].base_guild);

            let target_guild = client.guilds.cache.get(config.roles[i].extending_guild);
            let target_role = target_guild.roles.cache.find(role => role.id === config.roles[i].extending_role_id);
        
            let base_members = await base_guild.members.fetch();
            let target_members = await target_guild.members.fetch();
            
            base_members = Array.from(base_members.values());
            target_members = Array.from(target_members.values());

            for (j = 0; j < base_members.length; j++){
                let base_member = base_members[j];
                let target_member = target_members.find(member => member.id === base_member.id);
                if (target_member && base_member.roles.cache.has(target_role.id)) {
                    target_member.roles.add(target_role);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

client.login(process.env.CLIENT_TOKEN);