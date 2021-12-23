const EventEmitter = require('events');
const readline = require('readline');

rl = readline.Interface({
    input: process.stdin,
    output: process.stdout
})

const client = new EventEmitter();
const server = require('./server')(client)

// Minimal Interface Generator
server.on('response', (res) => {
    process.stdout.write('\u001B[2J\u001B[0;0f\n')
    process.stdout.write(`                                              Commands you can use
    ███╗   ███╗ █████╗ ██╗███╗   ██╗        1. \x1b[32madd\x1b[34m      (to add ... in the bucket)\x1b[37m
    ████╗ ████║██╔══██╗██║████╗  ██║        2. \x1b[32mdelete\x1b[34m   (to delete ... from the bucket)\x1b[37m
    ██╔████╔██║███████║██║██╔██╗ ██║        3. \x1b[32mls\x1b[34m       (to list ... from the bucket)\x1b[37m
    ██║╚██╔╝██║██╔══██║██║██║╚██╗██║        4. \x1b[32mhelp\x1b[34m     (to get help by for each command)\x1b[37m
    ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║        5. \x1b[32mexit\x1b[34m     (to close the application)\x1b[37m
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝        6. \x1b[32mabout\x1b[34m     (to get info about creator & author)\x1b[37m
                                    
    `)
    process.stdout.write(res)
    process.stdout.write('\n\> ')
})

// Processing Image Generator 
server.on('processing', (task) => {
    process.stdout.write(`
    ${task.name}
    ${task.taskline}
    `)
})

// env cleaner
server.on('clean', () => {
    process.stdout.write('\u001B[2J\u001B[0;0f\n')
})

// Basic Auth
server.on('Basic Auth', (options) => {
    process.stdout.write('_  What would you like to pick!')
    options.map((option) => {
        process.stdout.write(`\n ${options.indexOf(option)}. ${option} (type ...${option})`)
    })
    process.stdout.write('\n> ')
})

rl.on('line', (input) => {
    
    // Commands Filter
    [ commands, ...param ] = input.split(' ')

    switch(commands) {
        case 'add': {
            client.emit('add', [param] = param)
            break;
        }
        case 'delete': {
            client.emit('delete', [param] = param)
            break;
        }
        case 'ls': {
            client.emit('ls', [param] = param)
            break;
        }
        case 'help': {
            client.emit('help', [param] = param)
            break;
        }
        case 'about': {
            client.emit('about')
            break;
        }
        case 'exit': {
            client.emit('exit')
            break;
        }
        default: {
            client.emit('404', commands)
            break;
        }
    }
})