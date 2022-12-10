const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should to throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: true,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar content',
      owner: true,
      thread: 123,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    const payload = {
      content: 'sebuah komentar content',
      owner: 'user-123',
      thread: 'thread-123',
    };

    const { content, owner, thread } = new NewComment(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(thread).toEqual(payload.thread);
  });
});
