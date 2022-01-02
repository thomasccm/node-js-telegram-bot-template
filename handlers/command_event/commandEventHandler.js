const root = process.cwd();
const logger = require(`${root}/util/logger`)();
const {
  isPrivateChat,
  isGroupChat,
  isTagged,
} = require(`${root}/util/privilege`);
const {
  CommandConstructor,
} = require(`${root}/handlers/command_event/commandConstructor`);
const {
  translate,
} = (languageHandler = require(`${root}/handlers/languageHandler`));

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
  ctx.reply(translate("dev_1", ));
}

function reply(ctx) {
  var chatId = ctx.message.from.id;
  var msg = translate("dev_2", "default");
  var messageId = ctx.message.message_id;

  ctx.telegram.sendMessage(chatId, msg, {
    reply_to_message_id: messageId,
  });
}

function forward(ctx) {
  var chatId = ctx.message.from.id;
  var fromChatId = ctx.message.from.id;
  var messageId = ctx.message.message_id;

  ctx.telegram.forwardMessage(chatId, fromChatId, messageId);
}

function groupOnly(ctx) {
  if (isGroupChat(ctx)) {
    if (!isTagged(ctx)) {
      ctx.reply(translate("dev_1"));
    } else {
      return;
    }
  } else if (isPrivateChat(ctx)) {
    ctx.reply(translate("allowed_in_group_only"));
  }
}