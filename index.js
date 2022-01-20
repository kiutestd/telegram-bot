//Import telegraf
const { Telegraf } = require('telegraf');
const { Router, Markup } = Telegraf;
//Environment variables
const bot = new Telegraf(process.env.BOT_TOKEN)
const inviteLink = process.env.GROUP_INVITE_LINK;
const adminId = process.env.ADMIN_ID;

//Inline buttons
const inlineMessageRatingKeyboard = [[
    { text: 'درخواست عضویت در گروه تلگرام ✅', callback_data: '/join' }
]];

/*
*** Global values
*/

//Register message
registerText = (name) => {
    if (!name) name = "کاربر گرامی";
    return `سلام ${name} برای عضویت در گروه لطفا اطلاعات زیر رو همین پایین برام بنویس 😁👍

نام و نام خانوادگی : 
علاقه یا تخصص شما در حوزه تکنولوژی : 
آیدی اینستاگرام :

اطلاعات شما کاملا محفوظ میمونه و صرفا برای اینکه مطمئن بشیم تمام اعضای گروه از علاقه مندان به تکنولوژی باشن و در آینده مشکلی پیش نیاد این اطلاعات رو برسی میکنیم ❤️`
} 

//Confirmed message
confirmedText = (name) => {
    if (!name) name = "کاربر";
    return `ای ${name} عزیز اطلاعاتت مورد تایید ما بود ✅
از طریق این لینک میتونی به جمع ما بیپیوندی :
${inviteLink}
خیلی خوشحالیم که قراره خانوادمون بزرگ تر بشه 😍
فقط لطفا این لینک رو با کسی به اشتراک نذار 🙏🏻`
} 

//Not confirmed message
notConfirmedText = (name) => {
    if (!name) name = "کاربر";
    return `ای ${name} عزیز اطلاعاتت مورد تایید ما نیست 🚫
اگه سوالی داشتی ٬ به این آیدی پیام بده :
@kiumad_admin
موفق باشی 😊`
} 

//Welcome message
const welcomeMessage = "به ربات Tech Gap خوش اومدی 😃👋 دوست داری چه کاری برات انجام بدم؟";

//َUnknown message
const unknownMessage = "لطفا از دستورات پیشفرض ربات استفاده کنید 😊";

//Command status
var commandStatus = "start";

//words
const verificationWords = ["برنامه نویسی" , "کامپیوتر", "رشته", "نرم افزار", "شبکه", "دانشگاه", "زبان", "علاقه", "ویدئو", "javascript"];


/*App main*/

//Listen for start command
bot.start((ctx) => ctx.reply(welcomeMessage,{ reply_markup: JSON.stringify({ inline_keyboard: inlineMessageRatingKeyboard }) }));
//Listen /join command
bot.command('join', (ctx) => {
  ctx.reply(registerText(ctx.update.message.from.first_name));
  commandStatus = "join";
  });
bot.on('callback_query', (ctx) => {
	if (ctx.update.callback_query.data === '/join') {
    commandStatus = "join";
    bot.telegram.sendMessage(ctx.update.callback_query.from.id, registerText(ctx.update.callback_query.from.first_name));
  }
});
//Listen for /join answer
bot.on('text', (ctx) => {
  if (commandStatus === "join"){
    bot.telegram.sendMessage(ctx.update.message.from.id, "🤖 ربات در حال بررسی اطلاعات شما میباشد ...");
    const answerTemp = ctx.update.message.text;
    var verified = false;
    verificationWords.map(item => {
      if (answerTemp.includes(item)) {
        verified = true;
        commandStatus = "start";
        bot.telegram.sendMessage(ctx.update.message.from.id, confirmedText(ctx.update.message.from.first_name));
        bot.telegram.sendMessage(adminId , `کاربر جدید تایید شده ! ✅
👤 نام : ${ctx.update.message.from.first_name}
📝 متن : ${ctx.update.message.text}
🆔 کد کاربر : ${ctx.update.message.from.id}

ربات گروه تک گپ`);
      }
    })
    if (verified === false) {
      bot.telegram.sendMessage(ctx.update.message.from.id, notConfirmedText(ctx.update.message.from.first_name));
      bot.telegram.sendMessage(adminId , `کاربر تایید نشده ! 🚫
👤 نام : ${ctx.update.message.from.first_name}
📝 متن : ${ctx.update.message.text}
🆔 کد کاربر : ${ctx.update.message.from.id}

ربات گروه تک گپ`);
    }
  }else {
    //Listen unknown commands
    bot.on('text', ctx => ctx.reply(unknownMessage));
  }
});




//run App
bot.launch()
