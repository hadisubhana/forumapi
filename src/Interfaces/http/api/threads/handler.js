const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler({ payload, auth }, h) {
    const { id: credentialId } = auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ ...payload, owner: credentialId });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);
    return response;
  }

  async getThreadByIdHandler({ params }, h) {
    const { threadId } = params;
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const getThreadInfo = await getThreadUseCase.execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread: getThreadInfo,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
