exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
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
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
  });

  pgm.addConstraint('likes', 'fk_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE');

  pgm.addConstraint('likes', 'fk_likes.comment_comments.id', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
