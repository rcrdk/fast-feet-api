import { Module } from '@nestjs/common'

import { AuthenticateAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrator/authenticate'
import { RegisterAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrator/register'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/authenticate'
import { ChangeDeliveryPersonPasswordUseCase } from '@/domain/logistic/application/use-cases/delivery-person/change-password'
import { DeleteDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/delete'
import { EditDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/edit'
import { FetchDeliveryPeopleUseCase } from '@/domain/logistic/application/use-cases/delivery-person/fetch'
import { DeliveryPersonOrdersUseCase } from '@/domain/logistic/application/use-cases/delivery-person/orders'
import { RecoverDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/recover'
import { RegisterDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/register'
import { SearchDeliveryPeopleUseCase } from '@/domain/logistic/application/use-cases/delivery-person/search'
import { ViewDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/view'
import { CreateDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/create'
import { DeleteDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/delete'
import { EditDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/edit'
import { FetchDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/fetch'
import { RecoverDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/recover'
import { SearchDistributionCentersUseCase } from '@/domain/logistic/application/use-cases/distribution-center/search'
import { ViewDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/view'
import { ChangeDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/order/change-delivery-person'
import { CreateOrderUseCase } from '@/domain/logistic/application/use-cases/order/create'
import { DeleteOrderUseCase } from '@/domain/logistic/application/use-cases/order/delete'
import { FetchAvailableOrdersUseCase } from '@/domain/logistic/application/use-cases/order/fetch-available'
import { SearchOrdersUseCase } from '@/domain/logistic/application/use-cases/order/search'
import { ViewOrderUseCase } from '@/domain/logistic/application/use-cases/order/view'
import { SetOrderStatusPickedUseCase } from '@/domain/logistic/application/use-cases/order-status/picked'
import { SetOrderStatusTransferProgressUseCase } from '@/domain/logistic/application/use-cases/order-status/transfer-progress'
import { CreateReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/create'
import { DeleteReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/delete'
import { EditReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/edit'
import { FetchReceiversUseCase } from '@/domain/logistic/application/use-cases/receiver/fetch'
import { RecoverReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/recover'
import { SearchReceiversUseCase } from '@/domain/logistic/application/use-cases/receiver/search'
import { ViewReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/view'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateAdministratorController } from './controllers/administrator/authenticate.controller'
import { RegisterAdministratorAccountController } from './controllers/administrator/register-account.controller'
import { AuthenticateDeliveryPersonController } from './controllers/delivery-people/authenticate.controller'
import { ChangeDeliveryPersonPasswordController } from './controllers/delivery-people/change-password.controller'
import { DeleteDeliveryPersonAccountController } from './controllers/delivery-people/delete.controller'
import { EditDeliveryPersonAccountController } from './controllers/delivery-people/edit.controller'
import { FetchDeliveryPeopleAccountController } from './controllers/delivery-people/fetch.controller'
import { DeliveryPersonOrdersController } from './controllers/delivery-people/orders.controller'
import { RecoverDeliveryPersonAccountController } from './controllers/delivery-people/recover.controller'
import { RegisterDeliveryPersonAccountController } from './controllers/delivery-people/register-account.controller'
import { SearchDeliveryPeopleAccountController } from './controllers/delivery-people/search.controller'
import { ViewDeliveryPersonAccountController } from './controllers/delivery-people/view.controller'
import { CreateDistributionCenterController } from './controllers/distribution-center/create.controller'
import { DeleteDistributionCenterController } from './controllers/distribution-center/delete.controller'
import { EditDistributionCenterController } from './controllers/distribution-center/edit.controller'
import { FetchDistributionCenterController } from './controllers/distribution-center/fetch.controller'
import { RecoverDistributionCenterController } from './controllers/distribution-center/recover.controller'
import { SearchDistributionCenterController } from './controllers/distribution-center/search.controller'
import { ViewDistributionCenterController } from './controllers/distribution-center/view.controller'
import { FetchAvailableOrdersController } from './controllers/order/available.controller'
import { ChangeDeliveryPersonController } from './controllers/order/change-delivery-person.controller'
import { CreateOrderController } from './controllers/order/create.controller'
import { DeleteOrderController } from './controllers/order/delete.controller'
import { SearchOrdersController } from './controllers/order/search.controller'
import { ViewOrderController } from './controllers/order/view.controller'
import { SetOrderStatusPickedController } from './controllers/order-status/set-picked.controller'
import { SetOrderStatusTransferProgressController } from './controllers/order-status/set-transfer-process.controller'
import { CreateReceiverController } from './controllers/receiver/create.controller'
import { DeleteReceiverController } from './controllers/receiver/delete.controller'
import { EditReceiverController } from './controllers/receiver/edit.controller'
import { FetchReceiversController } from './controllers/receiver/fetch.controller'
import { RecoverReceiverController } from './controllers/receiver/recover.controller'
import { SearchReceiversController } from './controllers/receiver/search.controller'
import { ViewReceiverController } from './controllers/receiver/view.controller'

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
		DeliveryPersonOrdersController,
		ChangeDeliveryPersonPasswordController,

		CreateDistributionCenterController,
		EditDistributionCenterController,
		DeleteDistributionCenterController,
		RecoverDistributionCenterController,
		ViewDistributionCenterController,
		SearchDistributionCenterController,
		FetchDistributionCenterController,

		CreateReceiverController,
		EditReceiverController,
		DeleteReceiverController,
		RecoverReceiverController,
		ViewReceiverController,
		SearchReceiversController,
		FetchReceiversController,

		CreateOrderController,
		DeleteOrderController,
		ChangeDeliveryPersonController,
		FetchAvailableOrdersController,
		SearchOrdersController,
		ViewOrderController,

		SetOrderStatusPickedController,
		SetOrderStatusTransferProgressController,
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
		DeliveryPersonOrdersUseCase,
		ChangeDeliveryPersonPasswordUseCase,

		CreateDistributionCenterUseCase,
		EditDistributionCenterUseCase,
		DeleteDistributionCenterUseCase,
		RecoverDistributionCenterUseCase,
		ViewDistributionCenterUseCase,
		SearchDistributionCentersUseCase,
		FetchDistributionCenterUseCase,

		CreateReceiverUseCase,
		EditReceiverUseCase,
		DeleteReceiverUseCase,
		RecoverReceiverUseCase,
		ViewReceiverUseCase,
		SearchReceiversUseCase,
		FetchReceiversUseCase,

		CreateOrderUseCase,
		DeleteOrderUseCase,
		ChangeDeliveryPersonUseCase,
		FetchAvailableOrdersUseCase,
		SearchOrdersUseCase,
		ViewOrderUseCase,

		SetOrderStatusPickedUseCase,
		SetOrderStatusTransferProgressUseCase,
	],
})
export class HttpModule {}
