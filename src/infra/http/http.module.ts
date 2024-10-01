import { Module } from '@nestjs/common'

import { AuthenticateAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrator/authenticate'
import { RegisterAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrator/register'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/authenticate'
import { EditDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/edit'
import { RegisterDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/register'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateAdministratorController } from './controllers/administrator/authenticate.controller'
import { RegisterAdministratorAccountController } from './controllers/administrator/register-account.controller'
import { AuthenticateDeliveryPersonController } from './controllers/delivery-people/authenticate.controller'
import { EditDeliveryPersonAccountController } from './controllers/delivery-people/edit.controller'
import { RegisterDeliveryPersonAccountController } from './controllers/delivery-people/register-account.controller'

@Module({
	imports: [DatabaseModule, CryptographyModule, StorageModule],
	controllers: [
		AuthenticateAdministratorController,
		RegisterAdministratorAccountController,

		AuthenticateDeliveryPersonController,
		RegisterDeliveryPersonAccountController,
		EditDeliveryPersonAccountController,
	],
	providers: [
		AuthenticateAdministratorUseCase,
		RegisterAdministratorUseCase,

		AuthenticateDeliveryPersonUseCase,
		RegisterDeliveryPersonUseCase,
		EditDeliveryPersonUseCase,
	],
})
export class HttpModule {}
