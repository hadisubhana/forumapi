const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah get thread title',
      body: 'sebuah get thread body',
      date: '20221204',
      username: 'yeager',
      comments: [
        {
          id: 'comment-123',
          username: 'yeager',
          date: '20221204',
          replies: [
            {
              id: 'reply-123',
              content: 'sebuah reply content',
              date: '20221205',
              username: 'foster',
            },
          ],
          content: 'sebuah komentar content',
          likeCount: 1,
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah get thread title',
        body: 'sebuah get thread body',
        date: '20221204',
        username: 'yeager',
      })
    );

    mockCommentRepository.getAllCommentsInThread = jest.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'yeager',
          date: '20221204',
          content: 'sebuah komentar content',
          is_deleted: false,
        },
      ])
    );

    mockReplyRepository.getAllReplies = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          content: 'sebuah reply content',
          date: '20221205',
          username: 'foster',
          comment: 'comment-123',
          is_deleted: false,
        },
      ])
    );

    mockLikeRepository.getAllLikes = jest.fn(() =>
      Promise.resolve([
        {
          id: 'like-123',
          owner: 'user-123',
          comment: 'comment-123',
        },
      ])
    );

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const actualGetThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(actualGetThread).toEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getAllCommentsInThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getAllReplies).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.getAllLikes).toHaveBeenCalledWith('comment-123');
  });

  it('should return comments in thread with **komentar telah dihapus** content when the comment has been deleted', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah get thread title',
      body: 'sebuah get thread body',
      date: '20221204',
      username: 'yeager',
      comments: [
        {
          id: 'comment-123',
          username: 'yeager',
          date: '20221204',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah get thread title',
        body: 'sebuah get thread body',
        date: '20221204',
        username: 'yeager',
      })
    );

    mockCommentRepository.getAllCommentsInThread = jest.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'yeager',
          date: '20221204',
          content: 'sebuah komentar content',
          is_deleted: true,
        },
      ])
    );

    mockReplyRepository.getAllReplies = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          content: 'sebuah reply content',
          date: '20221205',
          username: 'foster',
          comment: 'comment-123',
          is_deleted: false,
        },
      ])
    );

    mockLikeRepository.getAllLikes = jest.fn(() => {
      Promise.resolve([]);
    });

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const actualGetThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(actualGetThread).toEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getAllCommentsInThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getAllReplies).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.getAllLikes).toHaveBeenCalledWith('comment-123');
  });

  // disini reply
  it('should return a reply in a comment with **balasan telah dihapus** content when the reply has been deleted', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah get thread title',
      body: 'sebuah get thread body',
      date: '20221204',
      username: 'yeager',
      comments: [
        {
          id: 'comment-123',
          username: 'yeager',
          date: '20221204',
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: '20221205',
              username: 'foster',
            },
          ],
          content: 'sebuah komentar content',
          likeCount: 0,
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah get thread title',
        body: 'sebuah get thread body',
        date: '20221204',
        username: 'yeager',
      })
    );

    mockCommentRepository.getAllCommentsInThread = jest.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'yeager',
          date: '20221204',
          content: 'sebuah komentar content',
          is_deleted: false,
        },
      ])
    );

    mockReplyRepository.getAllReplies = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          content: 'sebuah reply content',
          date: '20221205',
          username: 'foster',
          comment: 'comment-123',
          is_deleted: true,
        },
      ])
    );

    mockLikeRepository.getAllLikes = jest.fn(() => Promise.resolve([]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const actualGetThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(actualGetThread).toEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getAllCommentsInThread).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getAllReplies).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.getAllLikes).toHaveBeenCalledWith('comment-123');
  });
});
