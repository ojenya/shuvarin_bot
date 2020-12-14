// const { Telegraf } = require('telegraf')
// const bot = new Telegraf("1220579131:AAF4UaNPr67525T-Q2QsrDWQ-bCdmbb06h4") //сюда помещается токен, который дал botFather
// bot.start((ctx) => ctx.reply('Привет! Этот бот для оплаты какой-то шляпы! Для инструкций жми на /help')) //ответ бота на команду /start
// bot.help((ctx) => ctx.reply('Реквизиты для оплаты')) //ответ бота на команду /help
// bot.on('text', (ctx) => ctx.reply('Я всего лишь бот, не пиши мне(чао, персик)')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
// bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
// bot.launch() // запуск бота

const { Telegraf } = require('telegraf');
const covidApi = require('covid19-api');
const COUNTRIES_LIST = require('./const')
const bot = new Telegraf('1220579131:AAF4UaNPr67525T-Q2QsrDWQ-bCdmbb06h4')
bot.start( ctx => ctx.reply(`
Привет, ${ctx.from.first_name}!
Тут будет бот для получения реквизитов и всякого разного, но пока можно только узнай статистику по covid-19 и получить реквизиты.
Введи страну на английском языке и получи статистику. Получить весь список стран можно по команде /help. Отправь стикер и получишь реквизиты.
`))
bot.help( ctx => ctx.reply(COUNTRIES_LIST)) // список всех стран на английском языке можно взять в документации covid19-api
bot.on('sticker', (ctx) => ctx.reply(`
Респект таким ребятам👍 
Переводи на сбер: 8-800-555-35-35 `))
bot.on('text', async (ctx) => {
   try {
       const userText = ctx.message.text
       const covidData = await covidApi.getReportsByCountries(userText)
       const countryData = covidData[0][0]
       const formatData = `
Страна: ${countryData.country},
Случаи: ${countryData.cases},
Смерти: ${countryData.deaths},
Выздоровело: ${countryData.recovered}`
       ctx.reply(formatData)
   } catch(e) {
       ctx.reply('Такой страны не существует, для получения списка стран используй команду /help')
   }
})
bot.launch()