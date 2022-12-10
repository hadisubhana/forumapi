const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyToComment = this.postReplyToComment.bind(this);
    this.deleteReplyFromComment = this.deleteReplyFromComment.bind(this);
  }

  async postReplyToComment({ payload, params, auth }, h) {
    const { content } = payload;
    const { threadId, commentId } = params;
    const { id: credentialId } = auth.credentials;

    const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);
    const addedReply = await addCommentReplyUseCase.execute({ content, owner: credentialId, thread: threadId, comment: commentId });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplyFromComment({ params, auth }, h) {
    const { threadId, commentId, replyId } = params;
    const { id: credentialId } = auth.credentials;

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute({ id: replyId, comment: commentId, thread: threadId, owner: credentialId });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}

module.exports = ReplyHandler;
