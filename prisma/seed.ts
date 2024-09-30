import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	await prisma.user.create({
		data: {
			name: 'John Doe',
			documentNumber: '999.999.999-99',
			role: 'ADMINISTRATOR',
			phone: '(99) 9999-9999',
			email: 'admin@admin.com',
			password: await hash('12345', 8),
			city: 'Timbó',
			state: 'SC',
		},
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
