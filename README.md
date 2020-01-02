# VibeEngine
VibeEngine is a new CyberPatriot scoring engine for teams to use for practice in between competition and during the offseason. If you don't know what CyberPatriot is, well you can read up on it [here](https://www.uscyberpatriot.org/Pages/About/What-is-CyberPatriot.aspx).  
VibeEngine is being developed to act as a CyberPatiot competition simulator to be as close to the real competition as possible. This will give current and upcoming teams a feel for what competition is like and a chance to hone their skills outside of competition times. 

_Disclaimer: This readme does not go into too much detail due to everything still being in development._

The goal for the VibeEngine is to support both linux, windows, and any other custom scoring engine that you develop. The VibeEngine will come in two parts: VibeEngine Client and VibeEngine Server. While these are seperated into two parts there will be multiple ways to run the VibeEngine. Here are a few:  
- Standalone
    - Will run the client and server on the same machine, can be done offline with no network/LAN connection.
- Client
    - Will only run the client and report to a server that is hosted either on the LAN on publically hosted
- Server
    - Hosts the server seperate from the client, useful for custom scoring engines that only wish to use the scoreboard feature. 

## VibeEngine Client
The VibeEngine client is what is actually doing the scoring of the server. The client read from an enginer configuration file to know what to score. Once the score is created it is reported to a VibeEngine server. 

## VibeEngine Server  
The VibeEngine server is the brains of everything. Without a server there is no VibeEngine. Rounds are created on the VibeEngine server then a VibeEngine Client will register to the server to create teams and instances to be attached to a round. On the server is also the scoreboard. Not much has been thought out for the scoreboard yet since most of the focus for the project is being done on the backend.

# Development Status
Want to stay up to date with the development process of this. Follow the trello board [here](https://trello.com/b/q0H08yzb/vibeengine). I will try my best to keep this up to date and detailed with what is going on with the project as much as possible.   

# Contribution
I am the only developer for VibeEngine. If you would like assist in any way (ideas, development, marketing, etc..) feel free to contact me at contra_verde@protomail.com  
_Once Vibe Engine is fully released the Pull Requests and issues will be used for contributions._ 