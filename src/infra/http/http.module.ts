import { Module } from '@nestjs/common'

import { AuthenticateAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrator/authenticate'
import { RegisterAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrator/register'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/authenticate'
import { DeleteDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/delete'
import { EditDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/edit'
import { FetchDeliveryPeopleUseCase } from '@/domain/logistic/application/use-cases/delivery-person/fetch'
import { RecoverDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/recover'
import { RegisterDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/register'
import { SearchDeliveryPeopleUseCase } from '@/domain/logistic/application/use-cases/delivery-person/search'
import { ViewDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/view'
import { CreateDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/create'
import { DeleteDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/delete'
import { EditDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/edit'
import { RecoverDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/recover'
import { CreateReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/create'
import { DeleteReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/delete'
import { EditReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/edit'
import { RecoverReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/recover'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateAdministratorController } from './controllers/administrator/authenticate.controller'
import { RegisterAdministratorAccountController } from './controllers/administrator/register-account.controller'
import { AuthenticateDeliveryPersonController } from './controllers/delivery-people/authenticate.controller'
import { DeleteDeliveryPersonAccountController } from './controllers/delivery-people/delete.controller'
import { EditDeliveryPersonAccountController } from './controllers/delivery-people/edit.controller'
import { FetchDeliveryPeopleAccountController } from './controllers/delivery-people/fetch.controller'
import { RecoverDeliveryPersonAccountController } from './controllers/delivery-people/recover.controller'
import { RegisterDeliveryPersonAccountController } from './controllers/delivery-people/register-account.controller'
import { SearchDeliveryPeopleAccountController } from './controllers/delivery-people/search.controller'
import { ViewDeliveryPersonAccountController } from './controllers/delivery-people/view.controller'
import { CreateDistributionCenterController } from './controllers/distribution-center/create.controller'
import { DeleteDistributionCenterController } from './controllers/distribution-center/delete.controller'
import { EditDistributionCenterController } from './controllers/distribution-center/edit.controller'
import { RecoverDistributionCenterController } from './controllers/distribution-center/recover.controller'
import { CreateReceiverController } from './controllers/receiver/create.controller'
import { DeleteReceiverController } from './controllers/receiver/delete.controller'
import { EditReceiverController } from './controllers/receiver/edit.controller'
import { RecoverReceiverController } from './controllers/receiver/recover.controller'

@Module({
	imports: [DatabaseModule, CryptographyModule, StorageModule],
	controllers: [
		AuthenticateAdministratorController,
		RegisterAdministratorAccountController,

		AuthenticateDeliveryPersonController,
		RegisterDeliveryPersonAccountController,
		EditDeliveryPersonAccountController,
		DeleteDeliveryPersonAccountController,
		RecoverDeliveryPersonAccountController,
		ViewDeliveryPersonAccountController,
		SearchDeliveryPeopleAccountController,
		FetchDeliveryPeopleAccountController,

		CreateDistributionCenterController,
		EditDistributionCenterController,
		DeleteDistributionCenterController,
		RecoverDistributionCenterController,

		CreateReceiverController,
		EditReceiverController,
		DeleteReceiverController,
		RecoverReceiverController,
	],
	providers: [
		AuthenticateAdministratorUseCase,
		RegisterAdministratorUseCase,

		AuthenticateDeliveryPersonUseCase,
		RegisterDeliveryPersonUseCase,
		EditDeliveryPersonUseCase,
		DeleteDeliveryPersonUseCase,
		RecoverDeliveryPersonUseCase,
		ViewDeliveryPersonUseCase,
		SearchDeliveryPeopleUseCase,
		FetchDeliveryPeopleUseCase,

		CreateDistributionCenterUseCase,
		EditDistributionCenterUseCase,
		DeleteDistributionCenterUseCase,
		RecoverDistributionCenterUseCase,

		CreateReceiverUseCase,
		EditReceiverUseCase,
		DeleteReceiverUseCase,
		RecoverReceiverUseCase,
	],
})
export class HttpModule {}
