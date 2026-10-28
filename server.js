const http = require('http');

const CLEAR_SCREEN = '\x1b[2J\x1b[H';
const RESET_COLOR = '\x1b[0m';

const COLORS = [
    '\x1b[31m', '\x1b[33m', '\x1b[32m', '\x1b[36m', '\x1b[34m', '\x1b[35m'
];

const frames = [
`


     __   _  __               _ _ 
    / /  | |/ /___  _ __ ___ (_) |
   / /   | ' // _ \\| '_ \` _ \\| | |
  / /    | . \\ (_) | | | | | | | |
 /_/     |_|\\_\\___/|_| |_| |_|_|_|
                                  
 _    _ _ _                             _             

| |  | (_) |                           | |            
| |  | |_| |__   ___  ___  ___   _ __  | | ___ _ __   
| |  | | | '_ \\ / _ \\/ __|/ _ \\ | '_ \\ | |/ _ \\ '__|  
\\ \\_/ /| | |_) |  __/ (__| (_) || |_) || |  __/ |     
 \\___/ |_|_.__/ \\___|\\___|\\___/ | .__/ |_|\\___|_|     

                                | |                   
                                |_|                   

                      [  >  V I B E   O N  <  ]


`,
`


     __   _  __               _ _ 
    / /  | |/ /___  _ __ ___ (_) |
   / /   | ' // _ \\| '_ \` _ \\| | |
  / /    | . \\ (_) | | | | | | | |
 /_/     |_|\\_\\___/|_| |_| |_|_|_|
                                  
 _    _ _ _                             _             

| |  | (_) |                           | |            
| |  | |_| |__   ___  ___  ___   _ __  | | ___ _ __   
| |  | | | '_ \\ / _ \\/ __|/ _ \\ | '_ \\ | |/ _ \\ '__|  
\\ \\_/ /| | |_) |  __/ (__| (_) || |_) || |  __/ |     
 \\___/ |_|_.__/ \\___|\\___|\\___/ | .__/ |_|\\___|_|     

                                | |                   
                                |_|                   

                      [ >>  V I B E   O N  << ]


`,
`


     __   _  __               _ _ 
    / /  | |/ /___  _ __ ___ (_) |
   / /   | ' // _ \\| '_ \` _ \\| | |
  / /    | . \\ (_) | | | | | | | |
 /_/     |_|\\_\\___/|_| |_| |_|_|_|
                                  
 _    _ _ _                             _             

| |  | (_) |                           | |            
| |  | |_| |__   ___  ___  ___   _ __  | | ___ _ __   
| |  | | | '_ \\ / _ \\/ __|/ _ \\ | '_ \\ | |/ _ \\ '__|  
\\ \\_/ /| | |_) |  __/ (__| (_) || |_) || |  __/ |     
 \\___/ |_|_.__/ \\___|\\___|\\___/ | .__/ |_|\\___|_|     

                                | |                   
                                |_|                   

                      [ >>> V I B E   O N <<< ]


`
];

const server = http.createServer((req, res) => {
    // Форсируем отдачу только чистого текста, чтобы Render не пихал свой HTML/JS
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.writeHead(200);

    let frameIndex = 0;
    let colorIndex = 0;

    const interval = setInterval(() => {
        const color = COLORS[colorIndex];
        const frame = frames[frameIndex];
        const output = CLEAR_SCREEN + color + frame + RESET_COLOR;

        if (!res.write(output)) {
            clearInterval(interval);
            return;
        }

        frameIndex = (frameIndex + 1) % frames.length;
        colorIndex = (colorIndex + 1) % COLORS.length;
    }, 250);

    req.on('close', () => {
        clearInterval(interval);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
