import express from 'express';
import {registerUser, loginUser, userCredits} from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';
// import { paymentRazorpay } from '../controllers/paymentController.js';


const userRouter = express.Router()

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits' , userAuth,  userCredits);
userRouter.post('/pay-razor', userAuth);

export default userRouter;

//https://localhost:4000/api/user/register
//localhost : 4000/api/user/login