# space network

```
███████╗██████╗  █████╗  ██████╗███████╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝
███████╗██████╔╝███████║██║     █████╗  
╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝  
███████║██║     ██║  ██║╚██████╗███████╗
╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
```

> api attack manager for network testing

![version](https://img.shields.io/badge/version-2.0-blue)
![node](https://img.shields.io/badge/node-16+-green)
![status](https://img.shields.io/badge/status-active-brightgreen)

## what it does

stress test networks with different attack methods. built for security research and authorized testing only.

## features

- encrypted api calls
- real-time monitoring  
- target reconnaissance
- multiple attack vectors
- session management
- clean terminal ui

## attack methods

| method | power | description |
|--------|-------|-------------|
| udp    | 85%   | packet flood |
| tcp    | 90%   | connection spam |
| http   | 75%   | web stress |
| https  | 80%   | encrypted load |
| syn    | 95%   | half-open flood |
| icmp   | 70%   | ping spam |

## install

```bash
git clone https://github.com/spacevin/space-network
cd space-network
npm install
```

## usage

```bash
node api-manager.js
```

then follow the prompts:
- enter your credentials
- specify target ip/domain
- choose attack method
- set duration
- confirm and launch

## requirements

- node.js 16+
- valid api key
- stable connection
- authorized target only

## example

```
username: spacevin
target: 192.168.1.1:80
method: tcp
duration: 60s
```

## security

this tool encrypts all payloads and uses session-based auth. only use on networks you own or have permission to test.

## disclaimer

for educational and authorized testing only. respect laws and regulations. don't be stupid.

---

made with 💀 by spacevin | stay anonymous
```
