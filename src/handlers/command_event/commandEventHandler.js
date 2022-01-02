const root = process.cwd();
const logger = require(`${root}/src/util/logger`)();
const {
  isPrivateChat,
  isGroupChat,
  isTagged,
} = require(`${root}/src/util/privilege`);
const {
  CommandConstructor,
} = require(`${root}/src/handlers/command_event/commandConstructor`);
const {
  translate,
} = (languageHandler = require(`${root}/src/handlers/languageHandler`));

class CommandEventHandler {
  constructor(bot, botUsername) {
    this.bot = bot;
    this.botUsername = botUsername;
    this.load();
  }

  load() {
    const commandConstructor = new CommandConstructor(
      this.bot,
      this.botUsername
    );
    commandConstructor.newCommand("test", test);
    commandConstructor.newCommand("reply", reply);
    commandConstructor.newCommand("forward", forward);
    commandConstructor.newCommand("grouponly", groupOnly);
  }
}

module.exports = {
  CommandEventHandler,
};

function test(ctx) {
  // logger.debug(JSON.stringify(ctx.options.username));
  ctx.reply(translate("got_you_command"));
}

// command '/reply', reply your message
function reply(ctx) {
  var chatId = ctx.message.chat.id;
  var msg = translate("got_you_command", "default");
  var messageId = ctx.message.message_id;

  ctx.telegram.sendMessage(chatId, msg, {
    reply_to_message_id: messageId,
  });
}

// command '/forward', forward the message you replied or just forward your message
function forward(ctx) {
  var chatId = ctx.message.from.id;
  var fromChatId = ctx.message.chat.id;
  var messageId = ctx.message.reply_to_message ? ctx.message.reply_to_message.message_id : ctx.message.message_id;

  ctx.telegram.forwardMessage(chatId, fromChatId, messageId);
}

// command '/groupOnly', this command can only be used in group and with tagging of this bot
function groupOnly(ctx) {
  if (isGroupChat(ctx)) {
    if (isTagged(ctx)) {
      ctx.reply(translate("got_you_command"));
    } else {
      return;
    }
  } else if (isPrivateChat(ctx)) {
    ctx.reply(translate("allowed_in_group_only"));
  }
}