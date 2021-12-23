const EventEmitter = require('events');
const fs = require('fs');





class Register extends EventEmitter {
    constructor(client, previousData) {
        super()

        let taski = {
            data: { ...JSON.parse(previousData)},
            add: function(task) {
                this.data[String(Object.keys(this.data).length)] = task
            },
            delete: function(id) {
                if (id !== '') {
                    let selected = this.data[Number(id) - 1]
                    delete this.data[Number(id) - 1];
                    if (selected === undefined) {
                        this.AppStatus.body['data'] = 'There is no task with this pin!'
                        this.AppStatus.header['x-powered-by'] = 'node'
                        this.AppStatus.header['status'] = '200'
                        return '\x1b[32mPlease select the right one! [ \x1b[34mls\x1b[35m to list down]\x1b[37m'
                    } else {
                        this.AppStatus.body['data'] = selected
                        this.AppStatus.header['x-powered-by'] = 'node'
                        this.AppStatus.header['status'] = '200' 
                        return '\x1b[32mDeleted items are!\x1b[37m'
                    }
                } else {
                    this.AppStatus.body['data'] = 'Please enter the pin of the Task!'
                    this.AppStatus.header['x-powered-by'] = 'node'
                    this.AppStatus.header['status'] = '404'
                    return '\x1b[32mSelect some task to delete.\x1b[37m'
                }
            },
            ls: function() {
                let stringi = ''
                stringi += " \x1b[34mPin         Tasks\n"
                stringi += "--------------------------------------\n  "
                Object.values(this.data).forEach(data => stringi += "| \x1b[32m" + String(Object.values(this.data).indexOf(data)+ 1)  + "\x1b[34m | \x1b[37m   " + data + "\n\x1b[34m  -----\n  ")
                return stringi
            },
            AppStatus: {
                header: {},
                body: {}
            }
        }

        process.nextTick(() => {
            this.emit('response', `\x1b[34mType a command (help to list commands)\x1b[37m        > \x1b[34mYou have \x1b[33m${Object.keys(taski.data).length }\x1b[34m tasks in your bucket!\x1b[37m\n`)
        })


        client.on('add', (input) => {
            this.emit('clean')
            process.stdout.write(`> \x1b[34mYou have \x1b[33m${Object.keys(taski.data).length}\x1b[34m tasks in your bucket!\x1b[37m\n`)
            process.stdout.write(`                
     █████╗ ██████╗ ██████╗ 
    ██╔══██╗██╔══██╗██╔══██╗
    ███████║██║  ██║██║  ██║
    ██╔══██║██║  ██║██║  ██║
    ██║  ██║██████╔╝██████╔╝  

   ❕\x1b[32madded🦯\x1b[34m  ${(input).join(' ') }\x1b[37m
    \n> `)
            taski.add(input.join(' '))
        })

        client.on('delete', (input) => {
            this.emit('clean')
            process.stdout.write(`> \x1b[34mYou have \x1b[33m${Object.keys(taski.data).length}\x1b[34m tasks in your bucket!\x1b[37m\n                
  ██████╗ ███████╗██╗     ███████╗████████╗███████╗
  ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
  ██║  ██║█████╗  ██║     █████╗     ██║   █████╗  
  ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝  
  ██████╔╝███████╗███████╗███████╗   ██║   ███████╗
  ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝ 
  > ${ taski.delete(input) } <\n  ${taski.AppStatus.body.data}\n> `)
        })

        client.on('ls', (input) => {
            this.emit('clean')
            process.stdout.write(`> \x1b[34mYou have \x1b[33m${Object.keys(taski.data).length}\x1b[34m tasks in your bucket!\x1b[37m\n                
    ██╗     ███████╗
    ██║     ██╔════╝
    ██║     ███████╗
    ██║     ╚════██║
    ███████╗███████║
    ╚══════╝╚══════╝            
  >\x1b[33m List of all the tasks\x1b[37m <
  ${taski.ls()}\x1b[37m\n> `)
        })

        var help__command_details = {
            add: '\x1b[32madd\x1b[34m      (to add ... in the bucket)\x1b[37m',
            delete: '\x1b[32mdelete\x1b[34m   (to delete ... from the bucket)\x1b[37m',
            ls: '\x1b[32mls\x1b[34m       (to list ... from the bucket)\x1b[37m',
            help: '\x1b[32mhelp\x1b[34m     (to get help by for each command)\x1b[37m',
            exit: '\x1b[32mexit\x1b[34m     (to close the application)\x1b[37m',
            about: '\x1b[32mabout\x1b[34m     (to get info about creator & author)\x1b[37m'
        }

        var help__command_details_list = Object.values(help__command_details)

        client.on('help', (input) => {
            this.emit('clean')
            process.stdout.write(`> \x1b[34mYou have \x1b[33m${Object.keys(taski.data).length }\x1b[34m tasks in your bucket!\x1b[37m\n
            ██╗  ██╗███████╗██╗     ██████╗ ✔
            ██║  ██║██╔════╝██║     ██╔══██╗
            ███████║█████╗  ██║     ██████╔╝
            ██╔══██║██╔══╝  ██║     ██╔═══╝ 
            ██║  ██║███████╗███████╗██║     
            ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     
                        \n`)
            if (input == '') {
                process.stdout.write(`Commands you can use!\n`);
                help__command_details_list.map((command) => {
                    process.stdout.write("\n\t" + command)
                })
                process.stdout.write(`\n\n> `)
            } else {
                process.stdout.write(`\t  ${help__command_details[input]} \n> `)
            }
        })

        client.on('exit', () => {
            this.emit('clean')
            fs.writeFileSync('./tasks.json', JSON.stringify(taski.data),'utf8', (err)=> {console.error(err);})
            console.log('> Bye bye!...')
            process.exit()
        })

        client.on('404', (command) => {
            this.emit('clean')
            process.stdout.write(`> \x1b[34mNo command found named as\x1b[37m \n
        ██╗  ██╗ ██████╗ ██╗  ██╗    ███████╗██████╗ ██████╗  ██████╗ ██████╗ 
        ██║  ██║██╔═████╗██║  ██║    ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
        ███████║██║██╔██║███████║    █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
        ╚════██║████╔╝██║╚════██║    ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
             ██║╚██████╔╝     ██║    ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
             ╚═╝ ╚═════╝      ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
                                                                                  
        \x1b[32m☠  Command not Found ❗\x1b[33m        help\x1b[34m [ to get commands info ]\x1b[37m   \n> `)
        })
        
        client.on('about', () => {
            this.emit('clean')
            process.stdout.write(`
      👜 Purpose
        This application is purely build for learning purposes as a side project
        
      🚩 Author            
        ███████╗ █████╗ ██╗  ██╗ █████╗ ██████╗     ██╗███████╗██╗      █████╗ ███╗   ███╗
        ██╔════╝██╔══██╗██║  ██║██╔══██╗██╔══██╗    ██║██╔════╝██║     ██╔══██╗████╗ ████║
        █████╗  ███████║███████║███████║██║  ██║    ██║███████╗██║     ███████║██╔████╔██║
        ██╔══╝  ██╔══██║██╔══██║██╔══██║██║  ██║    ██║╚════██║██║     ██╔══██║██║╚██╔╝██║
        ██║     ██║  ██║██║  ██║██║  ██║██████╔╝    ██║███████║███████╗██║  ██║██║ ╚═╝ ██║
        ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝                                                      
        🏴 \x1b[33mGithub\x1b[37m: https://github.com/fahad-islam
        🏁 \x1b[34mTwitter\x1b[37m: https://twitter.com/_fahadislam 
        ------------------------------------------------
        \x1b[33mhelp\x1b[34m [ to get commands info ]\x1b[37m   \n>`)
        })
    }

}


var previousData = () => (fs.readFileSync('./tasks.json'))

const serverSide = (client) => new Register(client, previousData = previousData())

module.exports = serverSide;