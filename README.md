VibeEngine
==============

<!-- Logo placement-->

The cli to setup and configure the VibeEngine.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/github/package-json/v/C0ntra99/VibeEngine)](https://npmjs.org/package/VibeEngine_cli)
[![License](https://img.shields.io/github/license/C0ntra99/VibeEngine)](https://github.com/C0ntra99/VibeEngine/blob/master/LICENSE)

<!-- toc -->
* [Overview](#Overview)
* [Design](#Design)
  * [VibeEngine Server](#VibeEngine-Server)
  * [VibeEngine Client](#VibeEngine-Client)
* [Deployment](#Deployment)
* [Configuration](#Configuration)
  * [Usage](#usage)
  * [Commands](#commands)
* [Development status](#Development-status)
* [Contribution](#Contribution)
<!-- tocstop -->

# Overview
The VibeEngine is a CyberPatriot scoring engine for teams around the world to use as a practice resource. If you don't know what CyberPatriot is you can read up on it [here](https://www.uscyberpatriot.org/Pages/About/What-is-CyberPatriot.aspx).  

VibeEngine is created in such a way that it simulates a real world CyberPatriot competition. This means that teams will have the ability to create their own round and practice images.  

_Disclaimer: This readme does not go into too much detail due to everything still being in development._  


# Design
The engine is designed in 2 parts allowing for 3 ways of deployment. The two parts are as follows:

### VibeEngine-Server
The server is responsible for mangaging the scoring of the clients that are connected to it. In order for a VibeEngine Client to score the server it is running on it must be connected to a server. The server will periodally send a request to each of its connected clients to retrieve a score. All the scores for each round or connected client is then displayed on a webpage that is hosted by the server.  

_More info [Here](https://github.com/C0ntra99/VibeEngine-Server)_

### VibeEngine-Client
The client is responsible for the actual scoring of the instance. Once a score request is recieved from a server the client will read its scoring configuration file and score accordingly. Once the scoring is completed it will be sent back to the server to be displayed.

_More info [Here](https://github.com/C0ntra99/VibeEngine-Client)_

# Deployments
Since the VibeEngine is designed in a modular fashion it is flexible in how it is deployed. The 3 main deployment methods are described bellow:  

1. Server:
- Description: Is not running any sort of checks on the machine.  
- Reason: Meant to act as a centralized scoreboard for multiple connected clients that are on the same LAN.
2. Client
- Description: Only runs the checks on a machine. Does not have the ablity to display scores. 
- Reason: If there is already a VibeEngine Server deployed on the network.
3. Standalone
- Description: Hosts BOTH the VibeEngine Client and Server on the same machine. Meant for standalone instance scoring. Scoreboard and scoring logic is all in one place. 
- Reason: Meant to have the ability so if one person wanted to practive indivdually.

# Configuration
In order to properly configure the VibeEngine this CLI was written. This manages the installation and deployment process for the VibeEngine. 
## Usage
<!-- usage -->
```sh-session
$ npm install -g VibeEngine
$ VibeEngine COMMAND
running command...
$ VibeEngine (-v|--version|version)
VibeEngine_cli/0.0.0 linux-x64 node-v13.3.0
$ VibeEngine --help [COMMAND]
USAGE
  $ VibeEngine COMMAND
...
```
<!-- usagestop -->
## Commands
<!-- commands -->
* [`VibeEngine install`](#vibeengine-install)
* [`VibeEngine config`](#vibeengine-config)
* [`VibeEngine help [COMMAND]`](#vibeengine-help-command)

### `VibeEngine install`

Install VibeEngine components
```
USAGE
  $ VibeEngine install

OPTIONS
  -c, --config=config                  [default: VibeEngine.conf] Path to the configuration file
  -m, --mode=client|server|standalone  (required) VibeEngine mode

EXAMPLES
  $ VibeEngine install -m client -c VibeEngine.conf
  $ VibeEngine install -m server -c /home/user/VibeEngine.conf
  $ VibeEngine install --mode standalone

```

_See code: [src/commands/install.js](https://github.com/C0ntra99/VibeEngine/blob/master/src/commands/install.js)_

### `VibeEngine config`

Configure VibeEngine components
```
USAGE
  $ VibeEngine config

OPTIONS
  -c, --config=config  [default: VibeEngine.conf] Path to the configuration file
  -m, --mode=client|server|standalone 
```
_See code: [src/commands/config.js](https://github.com/C0ntra99/VibeEngine/blob/master/src/commands/config.js)_

### `VibeEngine help [COMMAND]`

display help for VibeEngine

```
USAGE
  $ VibeEngine help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->


# Development Status
Want to stay up to date with the development process of this. Follow the trello board [here](https://trello.com/b/q0H08yzb/vibeengine). I will try my best to keep this up to date and detailed with what is going on with the project as much as possible. 

# Contribution
I am the only developer for VibeEngine. If you would like assist in any way (ideas, development, marketing, etc..) feel free to contact me at contra_verde@protomail.com  
 
_Once Vibe Engine is fully released the Pull Requests and issues will be used for contributions._ 
