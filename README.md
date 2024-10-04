<!-- https://efficient-sloth-d85.notion.site/Desafio-04-a3a2ef9297ad47b1a94f89b197274ffd -->
<!-- https://www.figma.com/design/hn0qGhnSHDVst7oaY3PF72/FastFeet?node-id=0-1 -->

<!-- Update: Business Rules and Requirements -->
<!-- Update insomnia files -->
<!-- Update about the project -->

# 🚚 Fast Feet API
I developed this project as a challenge about my latest studies of Node at [Rocketseat](https://www.rocketseat.com.br).

## 🚀 Techs and Tools
- [Node.js v18](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io) / [PostgreSQL](https://www.postgresql.org/)  / [Docker](https://www.docker.com/)
- [Cloudflare R2](https://www.cloudflare.com/pt-br/) + [AWS SDK](https://github.com/aws/aws-sdk-js-v3)
- [Redis](https://redis.io) + [ioredis](https://github.com/redis/ioredis)
- [Insomnia](https://insomnia.rest/)
- [Vitest](https://vitest.dev/)

## 🖥️ Project
*Soon*

## ⚙️ Get started

### 1️⃣ Install dependencies and run services:
<details>
<summary>Display contents</summary>
	
```shell
npm i
docker compose up -d
npx prisma migrate dev # seeds will run along
npx prisma studio
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
	
Generate .env files for development and test. Then, set them up with Postgres database, Redis cache, JWT tokens and Cloudflare keys:

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
*Soon*
<!-- [![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20GymPass%20API%0A&uri=https://raw.githubusercontent.com/rcrdk/fast-feet-api/main/insomnia.json) -->

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
- [ ] It should be able to pick up a order;
- [ ] It should be able to mark a order as delivered;
- [ ] It should be able to mark a order as returned;
- [ ] It should be able to fetch orders with closest addresses to the delivery persons place;
- [x] It should be able to change the password of a user;
- [x] It should be able to fetch orders by a user;
- [ ] It should be able to notificate the receipient on each order status change;
- [ ] It should be able to allow receivers to track their recent orders;

### Business Rules

- [x] Only the admin user can make CRUD operations on another admin;
- [x] Only the admin user can make CRUD operations on delivery persons;
- [x] Only the admin user can make CRUD operations on orders;
- [x] Only the admin user can make CRUD operations on receivers;
- [x] Only the admin user can make CRUD operations on distribution centers;
- [ ] To make a order as shipped it must have to send a picture;
- [ ] Only the delivery person who pick up the order can mark it as shipped;
- [ ] Only a admin user can change a delivery person password;
- [ ] Only a admin user can change delivery person of an order;
- [ ] A delivery person can only fetch their own orders;
- [ ] A receiver should be able to track and see details of their orders;
- [x] It should be used soft deletes on all entities except on orders;

### Non Functional Requirements

- [x] The user password must be encypted;
- [x] All application data must be persisted on a postgreSQL database;
- [ ] All files should be stored on Cloudflare R2 bucket;
- [x] All data listed should be paginated with 20 itens by page;
- [x] All data searched should limit its results to 15 items;
- [x] The user must be identified by a JWT (JSON Web Token);