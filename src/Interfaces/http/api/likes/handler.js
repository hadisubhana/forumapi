const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeComment = this.putLikeComment.bind(this);
  }

  async putLikeComment({ params, auth }, h) {
    const { threadId, commentId } = params;
    const { id: credentialId } = auth.credentials;
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    await likeCommentUseCase.execute({ owner: credentialId, thread: threadId, comment: commentId });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
