const {Command, flags} = require('@oclif/command')
const prompt = require('prompt')
const colors = require('colors/safe')
const fs = require('fs')
const config_template = require('../templates/config_template')
const path = require('path')
//VibeEngine config -m {Server|Client|Standalone}
//Walks user through the setup process for whichever mode and will spit out a json file
//Json file is the config for the client and server,
//This command is used to generate the service file that is needed to read in environment variabled for the server and client
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

        //client_schema needs to include the path to the engine config itself
        let client_schema = {
            properties:{
                api:{
                    description:"Enter the IP address to listen on",
                    type:'string',
                    default:'0.0.0.0'
                },
                port:{
                    description:"Enter the port to listen on",
                    type:'string',
                    default:'8081'
                },
                server_ip:{
                    description:"Enter the IP address to the server",
                    type:'string',
                    default:'127.0.0.1'
                },
                server_port:{
                    description:'Enter the port the server is listening on',
                    type:'string',
                    default:'8080'
                },
                install_location:{
                    description:'Enter the path to install the client at',
                    type:'string',
                    default:'/etc/VibeEngine-Client'
                }
            }
        }
        const {flags} = this.parse(ConfigCommand)

        //This sort of works but need to add error handling...a lot of it 
        if(flags.interactive){
            
            prompt.start()
            if(flags.mode =='server'){
                prompt.message=colors.green(`VibeEngine Config:${flags.mode}`)
                prompt.get(server_schema, (err, res) => {
                    if(err) {
                        console.log(err)
                    }
                    //This is dumb and I'm 1000x certain there is a better way to do it
                    config_template.server.api.ip = res.api_ip;
                    config_template.server.api.port = res.api_port;
                    config_template.server.install_location = res.install_location;
                    
                    //Write the config to a file
                    var config_path;
                    if(!path.isAbsolute(flags.config)){
                        config_path = path.join(process.cwd(), flags.config)
                        fs.writeFileSync(config_path, JSON.stringify(config_template, null, 4), 'utf-8')
                        this.log(`Config created: ${path.join(process.cwd(), flags.config)}`)
                    } else {
                        config_path = flags.config
                        fs.writeFileSync(config_path, JSON.stringify(config_template, null, 4), 'utf-8')
                        this.log(`Config created: ${flags.config}`)
                    }
                    //Set env variable
                    process.env.VE_CONFIG_PATH = config_path
                })
            } else if (flags.mode =='client') {
                prompt.message=colors.green(`VibeEngine Config:${flags.mode}`)
                prompt.get(client_schema, (err, res) => {
                    if(!path.isAbsolute(flags.config)){
                        config_path = path.join(process.cwd(), flags.config)
                        fs.writeFileSync(config_path, JSON.stringify(config_template, null, 4), 'utf-8')
                        this.log(`Config created: ${path.join(process.cwd(), flags.config)}`)
                    } else {
                        config_path = flags.config
                        fs.writeFileSync(config_path, JSON.stringify(config_template, null, 4), 'utf-8')
                        this.log(`Config created: ${flags.config}`)
                    }
                })
            } else if (flags.mode == 'standalone') {
                prompt.message=colors.green(`VibeEngine Config:${flags.mode}:Server`)
                prompt.get(server_schema, (err, server_res) => {
                    config_template.server.api.ip = server_res.api_ip;
                    config_template.server.api.port = server_res.api_port;
                    config_template.server.install_location = server_res.install_location;
                    //Chaange the prompt so the user knows that is getting configured
                    prompt.message=colors.green(`VibeEngine Config:${flags.mode}:Client`)

                    prompt.get(client_schema, (err, client_res) => {
                        config_template.client.api.ip = client_res.api_ip;
                        config_template.client.api.port = client_res.api_port;
                        config_template.client.server.ip = client_res.server_ip;
                        config_template.client.server.port = client_res.server_port;
                        config_template.client.install_location = client_res.install_location;

                         var config_path;
                        if(!path.isAbsolute(flags.config)){
                            config_path = path.join(process.cwd(), flags.config)
                            fs.writeFileSync(config_path, JSON.stringify(config_template, null, 4), 'utf-8')
                            this.log(`Config created: ${path.join(process.cwd(), flags.config)}`)
                        } else {
                            config_path = flags.config
                            fs.writeFileSync(config_path, JSON.stringify(config_template, null, 4), 'utf-8')
                            this.log(`Config created: ${flags.config}`)
                        }
                    })
                })
                
            }
        } else if (!flags.interactive) {
            var config_path;
            if(!path.isAbsolute(flags.config)){
                config_path = path.join(process.cwd(), flags.config)
                fs.writeFileSync(config_path, JSON.stringify(config_template, null, 4), 'utf-8')
                this.log(`Created config with the base defaults at: ${path.join(process.cwd(), flags.config)}`)
            } else {
                config_path = path.join(flags.config)
                fs.writeFileSync(flags.config, JSON.stringify(config_template, null, 4), 'utf-8')
                this.log(`Created config with the base defaults at: ${flags.config}`)
            }

        }
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
        default:'VibeEngine.conf'
    }),
    mode:flags.string({
        char:'m',
        description:'VibeEgine mode',
        options:['client', 'server', 'standalone'],
        required:true
    })
}

module.exports = ConfigCommand;