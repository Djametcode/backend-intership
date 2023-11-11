# backend-intership

Backend Test Elemes By Tofik Hidayat

## Online Learning API

How To Install Progra

1. Make sure you installed nodeJS
   - node --version to check
2. Clone this repository
3. Open terminal check position by type ls. If you still see online-learning
   - Type cd online learning, Then npm install
4. in same folder, type touch .env. then open that folder

> [!IMPORTANT]
> You must do this step, if you skip then the API cannot run

1. edit the .env and fill

   ## create account on mongoDB atlas then click connect to get mongo url

   > MONGO_URL : create mongo db account and click connect
   > JWT_SECRET: fill with anything you want
   > JWT_TIMES : for example if you wanna choose 1 day then fill 1d

   ### create account on cloudinary first to fill this section

   > CLOUD_NAME : fill with your cloudinary cloud name
   > API_KEY : fill with your cloudinary api key
   > API_SECRET: fill with your cloudinary api secret

   ### fill admin code for registration new admin

   > SECRET_ADMIN : fill anything but important this is needed to register new admin

2. You ready to go

## How To Run Program

1. Type in terminal after installing
   > npm run dev - To run in dev mode
   > npm run start - To run in basic node or production

## API ROUTES

access http://localhost:3000/api-docs to see that
