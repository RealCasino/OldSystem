
MessageDispatcher = {
  handle: function (response, old) {
    msg = response.message;
    if (response.type == "balance") {
      TOTAL_MONEY = msg.balance;
      MIN_BET = msg.minBet;
      MAX_BET = msg.maxBet;
    } else if (response.type == "user") {
      TOTAL_MONEY = msg.balance;
      USER_NAME = msg.user.nick;
    }
  }
};
