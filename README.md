# Order-Anything-API
REST_APIs for simple order application

## TechStack :
<ul> 
  <li> Node.js</li>
  <li>Express.js</li>
  <li> MongoDB </li>
</ul>

## [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b2164096aa14b2d8e02e)
## WorkFlow : 
<ul> <li> created mongoDB models for users(customer,admin,shipper),orders and catalogue.
  <li> connected app to mongoDB database.
   <li> Registerd all users with mobile and password ,password is encrypted using bcrypt . Checked if the user is already registered it will give a  message that user already exists else saved the username and password in user database.</li>
<li> Registerd vendors with mobile and password ,password is encrypted using bcrypt . Checked if the vendor is already registered it will give a  message that vendor already exists else saved the username and password in user database.</li>
  <li>Before saving users into database checked if there credentials are valid or not.</li>
  <li> Users can login with its registered mobile and password.</li>
   <li> Customer can place orders.</li>
  <li> Driver can update orders status.</li>
</ul>

## Download Packages 
  npm install 
