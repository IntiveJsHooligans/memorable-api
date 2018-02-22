const newLink = {
  subscribe: (parent, args, ctx, info) => ctx.db.subscription.link(
      { },
      info,
    ),
};

const newVote = {
  subscribe: (parent, args, ctx, info) => ctx.db.subscription.vote(
      { },
      info,
    ),
};

module.exports = {
  newLink,
  newVote,
};