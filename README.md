# discord-role-sync
Sync roles between multiple discord servers.

## Config
In config.json, you will find a roles array. For every role you want to sync between servers, you should create a new object in that array, the schema for that object is as follows;
```js
    {
        "base_guild": "805298672475701249", // The "base" Guild ID, where the original role is.
        "base_role_id": "947745665335840779", // The "base" role ID. (Syncing Role)
        "extending_guild": "767525765490278430", // The Guild ID you want to sync this role to
        "extending_role_id": "951270256217841744" // The role ID of the synced role on the extending guild
    },
```

Any member in the "base" role will be added to the "extending" role in the other guild.

## Options
This check runs whenever the bot starts, it also runs on a cron timer which you can edit in the config. Whenever a member joins any guild, it checks all roles again to instantly sync the member's roles.

### This app is used in production and there for no prs will be accepted on master, please pr to dev for it to be reviewed.