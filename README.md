# Twitch for EvntBoard

Download last version from [EvntBoard/module-twitch](https://github.com/EvntBoard/module-twitch/releases/latest)

Extract the archive and run module-twitch executable from command line 

Generate a token from [twitchtokengenerator.com](https://twitchtokengenerator.com/quick/W42XlYrRkn) and copy / paste accessToken and clientId 

`./module-twitch --clientId=clientId --accessToken=accessToken`

## Params
    - --debug : show debug in console (false by default)
    - --host : Evntboard host (localhost by default)
    - --port : Evntboard port (5000 by default)
    - --name : its identifier to call it from a trigger module['twitch'] (twitch by default)