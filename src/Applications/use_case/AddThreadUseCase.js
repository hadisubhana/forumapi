const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const thread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
