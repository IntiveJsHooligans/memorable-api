function feed(parent, args, context, info) {
  const { filter, first, skip } = args; // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {};

  return context.db.query.links({ first, skip, where }, info);
}

function tasks(parent, args, context, info) {
  const { filter, first, skip } = args; // destructure input arguments
  const where = filter
    ? { OR: [
      { title_contains: filter },
      { description_contains: filter },
    ] }
    : {};

  return context.db.query.tasks({ first, skip, where }, info);
}

function taskStatuses(parent, args, context, info) {
  const { filter, first, skip } = args; // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }] }
    : {};

  return context.db.query.taskStatuses({ first, skip, where }, info);
}

module.exports = {
  feed,
  tasks,
  taskStatuses,
};
