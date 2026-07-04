#UserId and Password
##role:user
{
  "name": "Test",
  "email": "test@example.com",
  "password": "123456"
}
#role:admin
url:http://localhost:5173/admin/login
{
  "name": "admin",
  "email": "admin@test.com",
  "password": "123456",
  "role":"admin"

}

##steps for adding products in website 

#step1
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "123456"
}
Output:copy token it should be diff everytime

#step2
POST http://localhost:5000/api/categories
Authorization: Bearer <paste_token_here>
Content-Type: application/json

{
  "name": "cloth"
}
Output:copy id: 6a33bfb8a57d82919701e0a7

#step3

POST http://localhost:5000/api/products
Authorization: Bearer <paste_token_here>
Content-Type: multipart/form-data

name: Test Product
price: 999
stock: 10
category: <paste_category_id_here>
image: (attach any image file)
description:descption of product

<!-- /reference -->
https://www.chinayabanaras.com/

---------------------------
Rotes:
#user:
http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/register

#admin
http://localhost:5173/admin/login
http://localhost:5173/admin/dashboard
http://localhost:5173/admin/products
http://localhost:5173/admin/products/add
http://localhost:5173/admin/orders
http://localhost:5173/admin/categories
http://localhost:5173/admin/users



<<<<<<< HEAD
<!--  -->
https://auth0.com/docs/get-started/authentication-and-authorization-flow/which-oauth-2-0-flow-should-i-use
=======
links:
cards--https://uiverse.io/byllzz/great-wombat-13

3 cards--[text](https://uiverse.io/codebykay101/ugly-lion-23)
notebook open--[text](https://uiverse.io/eslam-hany/selfish-bobcat-73)
tubelight [text](https://uiverse.io/NK2552003/chatty-eel-90)
Profile:[](https://uiverse.io/IWhat1/strange-panther-78)
rotating earth:[text](https://uiverse.io/Lakshay-art/soft-dingo-98)
>>>>>>> 745618b19fa57f333978620be5744da63f28e41e
