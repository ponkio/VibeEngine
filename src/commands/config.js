const {Command, flags} = require('@oclif/command')
//VibeEngine config -m {Server|Client|Standalone}
//Walks user through the setup process for whichever mode and will spit out a json file
//Json file is the config for the client and server, 
/*
For client configuration the server will be null
For server confiuguration the client will be null
For standalone configuration both client and server will be populated
{
    config:{
        Server:{
            api:{
                ip:<Ip address to listen on. Default 0.0.0.0>,
                port:<port number to listen on. Default 8080>
            },
            install_location:<path to the install location. Default /etc/VibeEngine-Server>
        },
        Client:{
            api:{
                ip:<Ip addres to listen on. Default 0.0.0.0>,
                port:<port number to listen on. Default 8088>
            },
            server:{
                ip:<Ip address of the server. Default 127.0.0.1>,
                port:<Port the server's api is listening on. Default 8080>
            }
            install_location:<path to the install location. Default /etc/VibeEngine-Client>
        }
    }
}
*/
class ConfigCommand extends Command {
    async run(){
        const {flags} = this.parse(ConfigCommand)

        this.log(`CONFIG: ${flags.interactive}`)
    }
}

ConfigCommand.description = `Configure VibeEngine components`

ConfigCommand.flags = {
    interactive:flags.boolean({
        char:'i',
        default:true,
        description:'Generate the configuration file based on user input',
        hidden:true,
        allowNo:true
    }),
    config:flags.string({
        char:'c',
        description:'Path to the configuration file',
        default:'VibeEngine.conf',
    })
}

module.exports = ConfigCommand;