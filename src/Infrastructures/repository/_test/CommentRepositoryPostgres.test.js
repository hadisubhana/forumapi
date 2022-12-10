const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment Function', () => {
    it('should persist new comment', async () => {
      // Arrange
      const comment = new NewComment({
        content: 'sebuah komentar content',
        owner: 'user-123',
        thread: 'thread-123',
      });

      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const comment = new NewComment({
        content: 'sebuah komentar content',
        owner: 'user-123',
        thread: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // Stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const addedComment = await commentRepositoryPostgres.addComment(comment);
      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: comment.content,
          owner: comment.owner,
        })
      );
    });
  });

  describe('verify available comment function', () => {
    it('should to throw 404 when comment is not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw 404 when comment is available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verify comment owner function', () => {
    it('should to throw 403 when wrong owner is trying to access comment', async () => {
      // Arrange
      const owner = 'user-403';
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw 403 when correct owner is trying to access their comment', async () => {
      // Arrange
      const owner = 'user-123';
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('delete comment function', () => {
    it('should delete (hide) comment', async () => {
      // Arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({}); // add comment

      // Action
      await commentRepositoryPostgres.deleteComment(commentId); // delete comment
      const comment = await CommentsTableTestHelper.findCommentById(commentId);

      // // Assert
      expect(comment[0].is_deleted).toEqual(true);
      expect(comment[0]).toHaveProperty('is_deleted');
      expect(comment).toHaveLength(1);
    });
  });

  describe('getAllCommentsInThread function', () => {
    it('should return all comments correctly', async () => {
      // Assert
      const threadId = 'thread-123';
      const expectedResult = {
        id: 'comment-123',
        username: 'dicoding',
        content: 'sebuah komentar content',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({}); // add comment

      // Action
      const result = await commentRepositoryPostgres.getAllCommentsInThread(threadId);

      // Assert
      expect(result[0].id).toEqual(expectedResult.id);
      expect(result[0].username).toEqual(expectedResult.username);
      expect(result[0].content).toEqual(expectedResult.content);
      expect(result[0].date).toEqual('20221204'); // date default CommentsTableTesthelper
      expect(result[0]).toHaveProperty('date');
    });
  });
});
