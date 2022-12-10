const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread', async () => {
      // Arrange

      const thread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const thread = new NewThread({
        title: 'sebuah thread title postgres',
        body: 'bsebuah thread body postgres',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // Stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'sebuah thread title postgres',
          owner: 'user-123',
        })
      );
    });
  });

  describe('verifyAvailableThread', () => {
    it('should throw NotFoundError when thread is not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread is available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({}); // add thread

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread value correctly', async () => {
      // Arrange
      const expectedResult = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'body sebuah thread',
        username: 'dicoding',
      };

      await ThreadsTableTestHelper.addThread({}); // add thread
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const result = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(result.id).toEqual(expectedResult.id);
      expect(result.title).toEqual(expectedResult.title);
      expect(result.body).toEqual(expectedResult.body);
      expect(result.username).toEqual(expectedResult.username);
      expect(result.date).toEqual('20221204'); // date default pada ThreadsTableHelper
      expect(result).toHaveProperty('date');
    });
  });
});
