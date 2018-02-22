const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

function post(parent, { url, description }, context, info) {
  const userId = getUserId(context);

  return context.db.mutation.createLink(
    { data: { url, description, postedBy: { connect: { id: userId } } } },
    info,
  );
}

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context) {
  const user = await context.db.query.user({ where: { email: args.email } });
  if (!user) {
    throw new Error(`Could not find user with email: ${args.email}`);
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context);
  const { linkId } = args;
  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: linkId },
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${linkId}`);
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: linkId } },
      },
    },
    info,
  );
}

async function taskStatus(parent, args, context, info) {
  const { name } = args;
  const statusExists = await context.db.exists.TaskStatus({
    name: { name },
  });
  if (statusExists) {
    throw new Error(`Task status exists: ${name}`);
  }

  return context.db.mutation.createTaskStatus(
    {
      data: {
        name,
      },
    },
    info,
  );
}

function createTask(parent, args, context, info) {
  const userId = getUserId(context);

  const {
    completed,
    deadline,
    description,
    endDate,
    isPrivate,
    originalEstimate,
    priority,
    remaining,
    startDate,
    status,
    title,
  } = args;

  return context.db.mutation.createTask(
    {
      data: {
        createdBy: { connect: { id: userId } },
        completed,
        deadline,
        description,
        endDate,
        isPrivate,
        originalEstimate,
        priority,
        remaining,
        startDate,
        status,
        title,
      },
    },
    info,
  );
}

function updateTask(parent, args, context, info) {
  const {
    completed,
    deadline,
    description,
    endDate,
    id,
    isPrivate,
    originalEstimate,
    priority,
    remaining,
    startDate,
    status,
    title,
  } = args;

  return context.db.mutation.updateTask(
    {
      where: {
        id,
      },
      data: {
        completed,
        deadline,
        description,
        endDate,
        isPrivate,
        originalEstimate,
        priority,
        remaining,
        startDate,
        status,
        title,
      },
    },
    info,
  );
}

function deleteTask(parent, args, context, info) {
  const { id } = args;

  return context.db.mutation.deleteTask(
    {
      where: {
        id,
      },
    },
    info,
  );
}

module.exports = {
  post,
  signup,
  login,
  vote,
  taskStatus,
  createTask,
  updateTask,
  deleteTask,
};
