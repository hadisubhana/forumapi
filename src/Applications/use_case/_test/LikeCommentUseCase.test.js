const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');
const AddLike = require('../../../Domains/likes/entities/AddLike');

describe('LikeCommentUseCase', () => {
  it('should orchestrating Like Comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      thread: 'thread-123',
      comment: 'comment-123',
    };

    const liked = false;
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeStatus = jest.fn(() => Promise.resolve(liked));
    mockLikeRepository.like = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockLikeRepository.verifyLikeStatus).toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockLikeRepository.like).toHaveBeenCalledWith(new AddLike({ comment: useCasePayload.comment, owner: useCasePayload.owner }));
  });

  it('should orchestrating unlike comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      thread: 'thread-123',
      comment: 'comment-123',
    };

    const liked = true;
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeStatus = jest.fn(() => Promise.resolve(liked));
    mockLikeRepository.unlike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockLikeRepository.verifyLikeStatus).toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockLikeRepository.unlike).toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.owner);
  });
});
