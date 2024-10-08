# 🚚 Fast Feet API
I developed this project as a challenge about my latest studies of Node at [Rocketseat](https://www.rocketseat.com.br).

## 🚀 Techs and Tools
- [Node.js v18](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io) / [PostgreSQL](https://www.postgresql.org/)  / [Docker](https://www.docker.com/)
- [Cloudflare R2](https://www.cloudflare.com/pt-br/) + [AWS SDK](https://github.com/aws/aws-sdk-js-v3)
- [Insomnia](https://insomnia.rest/)
- [Vitest](https://vitest.dev/)

## 🖥️ Project
This project was coded to practice the development of an API using NestJS following the patterns of Domain-Driven Design (DDD)/Clean Architecture and SOLID along with other patterns such as factory pattern and repositories pattern. First up, it was created the domain entities and the use cases, alogn with unit tests. Then, it was created the controlers, e2e tests, value objects, mappers, repositories, presenters, integration with Cloudflare R2.

This is an API of a carrier company where it's possible to manage orders delivering. There's two types of userm, the administrator and the delivery person. The administrators can make all CRUD operations on receivers, delivery people, distribution centers and orders. A delivery person is able to pick a product in a distribution center and make the hole delivery of an order or even a part of the traject, they can change status of their orders.

In this project it was ensured that all application works by running all test over testing simply with routes on Insomnia. It was applied unit tests and E2E tests. It was used Vitest along with supertest to make requests on tests. It was implemented GitHub Actions to run unit tests on push and E2E tests on pull requests. Prisma was used as ORM and client alongside with PostgreSQL database to mage with data. To make the authentication it was used JWT (JSON Web Token) to persist user information with security into the application.

To get started with the flow of the application, you can register a new user and authenticate, or use data seeded to database after running migrations. Then, you are able to manage users, receivers, distribution centers and orders. You are able to test all routes on Insomnia, checkout for the link below.

## ⚙️ Get started

### 1️⃣ Install dependencies and run services:
<details>
<summary>Display contents</summary>
	
```shell
npm i
docker compose up -d
npx prisma migrate dev # seeds will run along
npx prisma studio # check on data created
```
</details>

### 2️⃣ Generate JWT keys:
<details>
<summary>Display contents</summary>
	
```shell
# Generate RSA256 secret and public keys: (Requires OpenSSL installed)
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Convert keys to Base64: (MacOS/Linux)
base64 -i private_key.pem -o private_key.txt
base64 -i public_key.pem -o public_key.txt
```

> [!TIP]
> **Use ChatGPT:**<br />
> 1) Private and public keys: "How to generate RS256 private and public keys on [YOUR OS]"<br />
> 2) Convert generated keys to base64: "How to convert file contents to base64 on [YOUR OS]"

</details>

### 3️⃣ Setup Cloudflare R2 services:
<details>
<summary>Display contents</summary>
	
It's need to create two Cloudflare R2 buckets, one for development and another for tests.
</details>

### 4️⃣ Set enviroment variables:
<details>
<summary>Display contents</summary>
	
Generate .env files for development and test. Then, set them up with Postgres database, JWT tokens and Cloudflare keys:

```shell
cp .env.example .env
cp .env.test.example .env.test
```
</details>

### 5️⃣ Run tests and start application:
<details>
<summary>Display contents</summary>
	
```shell
npm run test
npm run test:e2e
npm run start:dev
```
</details>

## 🔗 Routes
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20GymPass%20API%0A&uri=https://raw.githubusercontent.com/rcrdk/fast-feet-api/main/insomnia.json)

## 📋 Business Rules and Requirements

### Functional Requirements

- [x] This app should have only two kinds of user: admin or delivery person;
- [x] It should be able to authenticate with document number and password;
- [x] It should be able to create another administrators;
- [x] It should be able to make the CRUD of delivery person;
- [x] It should be able to make the CRUD of orders;
- [x] It should be able to make the CRUD of receivers;
- [x] It should be able to make the CRUD of distribution centers;
- [x] It should be able to mark a order as "posted" (available to pick up);
- [x] It should be able to pick up a order;
- [x] It should be able to mark a order as delivered;
- [x] It should be able to mark a order as returned;
- [x] It should be able to fetch orders with closest addresses to the delivery persons place;
- [x] It should be able to change the password of a user;
- [x] It should be able to fetch orders by a user;
- [x] It should be able to notificate the receipient on each order status change;

### Business Rules

- [x] Only the admin user can make CRUD operations on another admin;
- [x] Only the admin user can make CRUD operations on delivery persons;
- [x] Only the admin user can make CRUD operations on orders;
- [x] Only the admin user can make CRUD operations on receivers;
- [x] Only the admin user can make CRUD operations on distribution centers;
- [x] To make a order as shipped it must have to send a picture;
- [x] Only the delivery person who pick up the order can mark it as shipped;
- [x] Only a admin user can change a delivery person password;
- [x] Only a admin user can change delivery person of an order;
- [x] A delivery person can only fetch their own orders;
- [x] It should be used soft deletes on all entities except on orders;

### Non Functional Requirements

- [x] The user password must be encypted;
- [x] All application data must be persisted on a postgreSQL database;
- [x] All files should be stored on Cloudflare R2 bucket;
- [x] All data listed should be paginated with 20 itens by page;
- [x] All data searched should limit its results to 15 items;
- [x] The user must be identified by a JWT (JSON Web Token);