const {Command, flags} = require('@oclif/command')
const prompt = require('prompt')
const colors = require('colors/safe')
const fs = require('fs')

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
        let schema = {
            properties:{
                name1:{
                    description: "Enter name1 pls:",
                    type:'string',
                    default:'name1'
                },
                name2:{
                    description: "Enter name2:",
                    type:'string',
                    default:'name2'
                }
            }
        }
        const {flags} = this.parse(ConfigCommand)

        if(flags.interactive){
            prompt.message=colors.green(`VibeEngine Config:${flags.mode}`)
            prompt.start()
            prompt.get(schema, (err, res) => {
                if(err) {
                    console.log(err)
                }

            })
        } else if(!flags.config) {
            this.error("-c, --config= is required with the --no-interactive flag", {exit:1})
        }
        //this.log(`CONFIG: ${flags.interactive}`)
    }
}

ConfigCommand.description = `Configure VibeEngine components`

ConfigCommand.examples = [
    '$ VibeEngine config -m client',
    '$ VibeEngine config -m server',
    '$ VibeEngine config --no-interactive -c /tmp/client_config.conf'
]
ConfigCommand.flags = {
    interactive:flags.boolean({
        //char:'i',
        default:true,
        description:'Setting to false will skip the interactive walkthrough and read the config file that was passed.',
        hidden:true,
        allowNo:true
    }),
    config:flags.string({
        char:'c',
        description:'Path to the configuration file',
        dependsOn:['interactive']
        //default:'VibeEngine.conf'
    }),
    mode:flags.string({
        char:'m',
        description:'VibeEgine mode',
        options:['client', 'server', 'standalone'],
        required:true
    })
}

module.exports = ConfigCommand;