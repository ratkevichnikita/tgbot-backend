const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const token = '6101662912:AAFqsGNZ6vrNq7tbkRwaNJPy0a4QsU9hyFg'
const webAppUrl = 'https://ratkevichnikita.github.io/tgbot/';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET','POST']
}));
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, `Добрый день уважаемые друзья! В нашем магазине вы сможете найти развивающие товары, игрушки и книжки на русском языке для детей от 2 до 5 лет`)
        await bot.sendMessage(chatId, `Для перехода в магазин, пожалуйста, нажмите синюю кнопку слева от строки ввода текста`)
        await bot.sendMessage(chatId, `Если вдруг возникли технические сложности или любые другие уточняющие вопросы по нашему товару, просим вас написать @Juleera`)
    }

    // if(msg?.web_app_data?.data) {
    //     try {
    //         const data = JSON.parse(msg?.web_app_data?.data)
    //         console.log(data)
    //         const info = data.productInfo?.map(item => ` ${item.title} - ${item.count} шт. `).join('')
    //         const message = `Ваш заказ: ${info}`

    //         await bot.sendMessage(chatId, message)
    //         await bot.sendMessage(chatId, `Способ оплаты: ${data.payment}`);
    //         await bot.sendMessage(chatId, `Ваше местоположение: ${data.location}` );

    //         setTimeout(async () => {
    //             await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
    //         }, 3000)
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
});

      

app.post('/web-data', async (req, res) => {
    const {queryId, productInfo = [], payment, totalSum, location, userName} = req.body;
    const info = productInfo.flatMap(item => ` ${item.title} - ${item.count} шт. `);
    const message = `Ваш заказ: ${info}. На сумму ${totalSum}. Способ оплаты: ${payment}. Локация: ${location}.`

    const message_admin = `Ваш заказ: ${info}. 
    На сумму ${totalSum}. \n
    Способ оплаты: ${payment}. \n
    Локация: ${location}. \n
    Пользователь: ${userName}
    `
    axios.post(`https://api.telegram.org/bot${token}/sendMessage?chat_id=@smart_seeds_toys&text=${message_admin}`)
    
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: message
            }
        })
        
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))

