const {Command, flags} = require('@oclif/command')
const prompt = require('prompt')
const colors = require('colors/safe')
const fs = require('fs')
const config_template = require('../templates/config_template')
//VibeEngine config -m {Server|Client|Standalone}
//Walks user through the setup process for whichever mode and will spit out a json file
//Json file is the config for the client and server,
//During the runtime of this command the -c flag will set an environemnt variable to store the location of the config file
/*
For client configuration the server should be null
For server confiuguration the client should be null
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
        //Show how the command is grabbed
        let server_schema = {
            properties:{
                api_ip:{
                    description: "Enter the IP address to listen on",
                    type:'string',
                    default:'0.0.0.0'
                },
                api_port:{
                    description: "Enter the port to listen on",
                    type:'string',
                    default:'8080'
                },
                install_location:{
                    description:"Enter the path to install the server at",
                    type:'string',
                    default:'/etc/VibeEngine-Server'
                }
            }
        }

        let client_schema = {
            properties:{
                api:[{
                    ip:{
                        description:"test nested thing",
                        type:'string'
                    },
                    port:{
                        description:"nested thing 2",
                        trype:'string'
                    }
                }]
            }
        }
        const {flags} = this.parse(ConfigCommand)

        if(flags.interactive){
            prompt.message=colors.green(`VibeEngine Config:${flags.mode}`)
            prompt.start()
            if(flags.mode =='server'){
                prompt.get(server_schema, (err, res) => {
                    if(err) {
                        console.log(err)
                    }

                    //This is dumb and I'm 1000x certain there is a better way to do it
                    config_template.server.api.ip = res.api_ip;
                    config_template.server.api.port = res.api_port;
                    config_template.server.install_location = res.install_location;
                    
                    //Write the config to a file
                    this.log(config_template)
                })
            } else if (flags.mode =='client') {
                prompt.get(client_schema, (err, res) => {
                    this.log(res)
                })
            }
        } else if(!flags.config) {
            this.log(`Creating server with the defaults: ${JSON.stringify(config_template)}`)
            //this.error("-c, --config= is required with the --no-interactive flag", {exit:1})
        }

        this.log(flags.config)
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
        //dependsOn:['interactive']
        //During runtime of this command the path will get set to an env variable
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