exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE');

  pgm.addConstraint('comments', 'fk_comments.thread_threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE ON UPDATE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
