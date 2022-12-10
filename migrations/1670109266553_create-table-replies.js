exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment: {
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

  pgm.addConstraint('replies', 'fk_replies.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE');

  pgm.addConstraint('replies', 'fk_replies.comment_comments.id', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
