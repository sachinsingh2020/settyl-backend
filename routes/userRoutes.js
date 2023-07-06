import express from 'express';
import { getAllUsers, getMyDetails, isUserLoggedIn, login, logout, register } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/logout').get(logout);

router.route('/check').get(isUserLoggedIn);

router.route('/me').get(isAuthenticated, getMyDetails);

router.route('/allusers').get(isAuthenticated, getAllUsers);

export default router;
