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