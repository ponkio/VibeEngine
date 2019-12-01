import argparse
import configparser
import logging

logger = logging.getLogger(__name__)
def parse_cli_args():
    ''' Command line arguments
-c --config [Path to config file]
-m --mode [Standalone|Client|Server]
-e --engine [Path to engine]
-s --server [Server IP address when mode == client]
'''
    logger.info("Parsing cli arguments")
    parser = argparse.ArgumentParser(description="CyberPatrio Scoring Engine cli")

    ## Force the decision of either -c or -m
    mparser = parser.add_mutually_exclusive_group()
    
    mparser.add_argument('-c', '--config', action='store', help='Path to the engine configuration file.')
    mparser.add_argument('-m', '--mode', action='store',choices=['standalone', 'client', 'server'], help='Chose how the engine will score/communicate')
    
    standalone_group = parser.add_argument_group('Standalone Options', description='Options for when running CPEngine in standalone mode.')
    engine = standalone_group.add_argument('-e', '--engine', action='store', help='Path to the Scoring Engine file.')

    server_group = parser.add_argument_group('Server Options', description='Options for when running the CPEngine Server')
    server_group._group_actions.append(engine)
    port = server_group.add_argument('-p', '--port', action='store', help='Port for server to listen on', default='46415')

    client_group = parser.add_argument_group('Client Options', description='Options for when running the CPEngine Client')
    client_group.add_argument('-s', '--server', action='store', help='Ip address or hostname to a CPEngine Server.')
    client_group._group_actions.append(port)

    return parser.parse_args()

def parse_config_args(configFile):
    logger.info(f"Parsing config arguments from {configFile}")
    config_parser = configparser.ConfigParser()
    config_parser.read(configFile)
    return dict(config_parser)
