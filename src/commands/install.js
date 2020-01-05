const {Command, flags} = require('@oclif/command')

//VibeEngine install -m {Server|Client|Standalone} -c <path to config location>
// if the config location does not exist then run through config/setup process (see ../config/index.js for the config layout)
class InstallCommand extends Command {
    async run(){
        const {flags} = this.parse(InstallCommand)
        this.log(`INSTALL: ${flags.mode}`)
    }
}

InstallCommand.description = `Install VibeEngine components`

InstallCommand.examples = [
    '$ VibeEngine install -m client -c VibeEngine.conf',
    '$ VibeEngine install -m server -c /home/user/VibeEngine.conf',
    '$ VibeEngine install --mode standalone'
]

InstallCommand.flags = {
    mode:flags.string({
        char:'m',
        description:'VibeEngine mode',
        options:['client', 'server', 'standalone'],
        required:true
    }),
    config:flags.string({
        char:'c',
        description:'Path to the configuration file',
        default:'VibeEngine.conf',
    })
}

module.exports = InstallCommand;