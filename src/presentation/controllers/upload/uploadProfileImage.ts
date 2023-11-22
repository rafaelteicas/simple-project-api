import { type GetAccountById } from '../../../data/useCases/user/getAccountById'
import { type UserRepository } from '../../../infra/typeorm/repositories/userRepository'
import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { type Storage } from '../../../domain/storage/storage'
import { response } from '../../helpers/http'

export class UploadProfileImage implements Controller {
  private readonly getAccountById: GetAccountById
  private readonly userRepository: typeof UserRepository
  private readonly storage: Storage

  constructor (
    getAccountById: GetAccountById,
    userRepository: typeof UserRepository,
    storage: Storage
  ) {
    this.userRepository = userRepository
    this.getAccountById = getAccountById
    this.storage = storage
  }

  async handle (request: HttpRequest<any>): Promise<HttpResponse> {
    const USER_ID = request.params?.id
    try {
      if (!USER_ID) throw new Error()
      const user = await this.getAccountById.get(USER_ID)
      if (!user || !request.fileImage) throw new Error()
      const newUrl = await this.storage.uploadFile(
        request.fileImage.buffer,
        USER_ID,
        { contentType: request.fileImage.mimetype }
      )
      if (typeof newUrl === 'string') {
        user.profile_image = newUrl
        await this.userRepository.save(user)
      }
      return response('success')
    } catch (er) {
      return response('serverError')
    }
  }
}
