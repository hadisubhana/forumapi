const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply Function', () => {
    it('should persist add reply', async () => {
      // Arrange
      const reply = new AddReply({
        content: 'sebuah reply content x',
        owner: 'user-123',
        comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(reply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const reply = new AddReply({
        content: 'sebuah reply content',
        owner: 'user-123',
        comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // Stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(reply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: reply.content,
          owner: reply.owner,
        })
      );
    });
  });

  describe('verify available reply function', () => {
    it('should to throw 404 when reply is not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw 404 when reply is available', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({}); // add reply

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verify comment owner function', () => {
    it('should to throw 403 when wrong owner is trying to access comment', async () => {
      // Arrange
      const owner = 'user-403';

      await RepliesTableTestHelper.addReply({}); // add reply

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', owner)).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw 403 when correct owner is trying to access their comment', async () => {
      // Arrange
      const owner = 'user-123';
      await RepliesTableTestHelper.addReply({}); // add reply

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', owner)).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('delete comment function', () => {
    it('should delete comment', async () => {
      // Arrange
      const id = 'reply-123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({}); // add reply

      // Action
      await replyRepositoryPostgres.deleteReply(id);
      const reply = await RepliesTableTestHelper.findReplyById(id);

      // Assert
      expect(reply[0].is_deleted).toEqual(true);
      expect(reply[0]).toHaveProperty('is_deleted');
      expect(reply).toHaveLength(1);
    });
  });

  describe('getAllReplies function', () => {
    it('should return all replies correctly', async () => {
      // Assert
      const commentId = 'comment-123';
      const expectedResult = {
        id: 'reply-123',
        content: 'sebuah reply content',
        date: '20221204',
        username: 'dicoding',
        comment: 'comment-123',
        is_deleted: false,
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({}); // add reply

      // Action
      const result = await replyRepositoryPostgres.getAllReplies(commentId);

      // Assert
      expect(result[0].id).toEqual(expectedResult.id);
      expect(result[0].username).toEqual(expectedResult.username);
      expect(result[0].content).toEqual(expectedResult.content);
      expect(result[0].comment).toEqual(expectedResult.comment);
      expect(result[0].is_deleted).toEqual(expectedResult.is_deleted);
      expect(result[0].date).toEqual('20221204'); // date default RepliesTableTestHelper
      expect(result[0]).toHaveProperty('date');
    });
  });
});
