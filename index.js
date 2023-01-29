const TelegramBot = require('node-telegram-bot-api');

const token = '5939397200:AAH9rcFroMXSbWnuhTQcybx_NoIWt-rnAzs'
const webAppUrl = 'https://1ab9-103-100-173-232.ap.ngrok.io/';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if(text === '/start') {

        // await bot.sendMessage(chatId,'Ниже появится кнопка',{
        //     reply_markup: {
        //         keyboard: [
        //             [{text:'заполнить форму', web_app: {url:webAppUrl}}]
        //         ]
        //     }
        // })
        await bot.sendMessage(chatId,'заходите в наш интернет магазин',{
            reply_markup: {
                inline_keyboard: [
                    [{text:'сделать заказ', web_app: {url:webAppUrl}}]
                ]
            }
        })
    }
    console.log('msg?.web_app_data?', msg?.web_app_data)
    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId, 'Спасибо за ваш заказ. Наш енджер свяжится с вами в ближайшее время для подтверждения')
            await bot.sendMessage(chatId,'Ваш способ оплаты', data.payment)
        } catch (error) {
            console.log(error)

        }
    }
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});



