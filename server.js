const http = require('http');

// ANSI-коды для управления терминалом
const CLEAR_SCREEN = '\x1b[2J\x1b[H'; // Очистить экран и поднять курсор вверх
const RESET_COLOR = '\x1b[0m';       // Сбросить цвет

const COLORS = [
    '\x1b[31m', // Красный
    '\x1b[33m', // Желтый
    '\x1b[32m', // Зеленый
    '\x1b[36m', // Циановый
    '\x1b[34m', // Синий
    '\x1b[35m'  // Пурпурный
];

// Кадры анимации (слова отцентрованы для стандартной CMD шириной 80 символов)
// Между кадрами меняется нижний индикатор [ >>> ] для эффекта движения
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
    const userAgent = req.headers['user-agent'] || '';
    
    // Браузерам показываем обычную подсказку
    if (!userAgent.includes('curl')) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Скопируй команду и запусти в CMD: curl ' + (req.headers.host || 'ссылка'));
        return;
    }

    // Включаем потоковую передачу для curl
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    });

    let frameIndex = 0;
    let colorIndex = 0;

    const interval = setInterval(() => {
        const color = COLORS[colorIndex];
        const frame = frames[frameIndex];

        // Очищаем экран, красим в цвет, выводим арт, сбрасываем цвет
        const output = CLEAR_SCREEN + color + frame + RESET_COLOR;

        if (!res.write(output)) {
            clearInterval(interval);
            return;
        }

        frameIndex = (frameIndex + 1) % frames.length;
        colorIndex = (colorIndex + 1) % COLORS.length;
    }, 250); // Скорость смены цветов и кадров (250 мс)

    req.on('close', () => {
        clearInterval(interval);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер активен на порту ${PORT}`);
});
