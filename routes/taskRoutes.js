import express from 'express';
import { allTasks, createTask, deleteTask, doneCompleteTask, getStatusTasks, myTasks, updateTask } from '../controllers/taskController.js';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';


const router = express.Router();

router.route('/create').post(isAuthenticated, authorizeAdmin, createTask);

router.route('/tasks').get(isAuthenticated, allTasks);

router.route('/update').put(isAuthenticated, authorizeAdmin, updateTask);

router.route('/delete').put(isAuthenticated, authorizeAdmin, deleteTask);

router.route('/status').get(isAuthenticated, authorizeAdmin, getStatusTasks);

router.route('/completed').put(isAuthenticated, doneCompleteTask);

router.route('/mytasks').get(isAuthenticated, myTasks);

export default router;
