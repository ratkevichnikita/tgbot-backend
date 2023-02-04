const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5939397200:AAH9rcFroMXSbWnuhTQcybx_NoIWt-rnAzs'
const webAppUrl = 'https://fe8e-103-100-173-232.ap.ngrok.io';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl}}]
                ]
            }
        })

        // await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
        //     reply_markup: {
        //         inline_keyboard: [
        //             [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
        //         ]
        //     }
        // })
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            const info = data.productInfo.flatMap(item => ` ${item.title} - ${item.count} шт. `)
            const message = `Ваш заказ: ${info}`

            await bot.sendMessage(chatId, message)
            await bot.sendMessage(chatId, `Способ оплаты: ${data.payment}`);
            await bot.sendMessage(chatId, `Ваше местоположение: ${data.location}` );

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, productsInfo = [], payment, totalSum, location} = req.body;
    const info = productsInfo.flatMap(item => ` ${item.title} - ${item.count} шт. `)
    const message = `Ваш заказ: ${info}. На сумму ${totalSum}`
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



