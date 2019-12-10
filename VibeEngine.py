from helpers.Utils import parse_cli_args, parse_config_args
import logging
from Submodules.client.client import Client
from subprocess import Popen, PIPE

def main(args):
    if cli_args.config:
        logger.debug("Config running")
    else:
        logger.debug("CLI running")

        if cli_args.mode == "standalone":
            pass
        elif cli_args.mode == "client":
            pass
        elif cli_args.mode == "server":
            logger.info("Starting VibeEngine Server")

            ## This isnt very pretty, but neither am I 
            ## it works atleast
            ## I really need to get away from "it works" mentality...
            ## Still need to pass the listening IP and port
            process = Popen(['node', 'Submodules/server/main.js'], stdout=PIPE, stderr=PIPE)
            stdout, stderr = process.communicate()
    pass

if __name__ == "__main__":
    logging.basicConfig(filename='VibeEngine.log', filemode='w', format='%(asctime)s:%(name)s:%(levelname)s:%(message)s', level='DEBUG')
    logger = logging.getLogger(__name__)
    logger.info("Starting VibeEngine")

    cli_args = parse_cli_args()
    if cli_args.config:
        main(parse_config_args(cli_args.config))
    else:
        main(cli_args)
