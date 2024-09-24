<!-- https://efficient-sloth-d85.notion.site/Desafio-04-a3a2ef9297ad47b1a94f89b197274ffd -->
<!-- https://www.figma.com/design/hn0qGhnSHDVst7oaY3PF72/FastFeet?node-id=0-1 -->

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
Lorem ipsum

## ⚙️ Get started
Lorem ipsum

## 🔗 Routes
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20GymPass%20API%0A&uri=https://raw.githubusercontent.com/rcrdk/fast-feet-api/main/insomnia.json)

## 📋 Business Rules and Requirements

### Functional Requirements

- [x] This app should have only two kinds of user: admin or delivery person;
- [x] It should be able to authenticate with document number and password;
- [ ] It should be able to make the CRUD of delivery person;
- [ ] It should be able to make the CRUD of orders;
- [ ] It should be able to make the CRUD of receivers;
- [ ] It should be able to mark a order as "posted" (available to pick up);
- [ ] It should be able to pick up a order;
- [ ] It should be able to mark a order as delivered;
- [ ] It should be able to mark a order as returned;
- [ ] It should be able to fetch orders with closest addresses to the delivery persons place;
- [ ] It should be able to change the password of a user;
- [ ] It should be able to fetch orders by a user;
- [ ] It should be able to notificate the receipient on each order status change;

### Business Rules

- [ ] Only the admin user can make CRUD operations on delivery persons;
- [ ] Only the admin user can make CRUD operations on orders;
- [ ] Only the admin user can make CRUD operations on receivers;
- [ ] To make a order as shipped it must have to send a picture;
- [ ] Only the delivery person who pick up the order can mark it as shipped;
- [ ] Only a admin user can change a user password;
- [ ] A delivery person can only fetch their own orders;

### Non Functional Requirements

- [x] The user password must be encypted;
- [x] All application data must be persisted on a postgreSQL database;
- [ ] All files should be stored on Cloudflare R2 bucket;
- [ ] All data listed should be paginated with 20 itens by page;
- [ ] The user must be identified by a JWT (JSON Web Token);