import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { Task } from "../models/taskModel.js";

export const createTask = catchAsyncError(async (req, res, next) => {
    const { title, description, dueDate } = req.body;

    // console.log(title, description, dueDate);

    let users = JSON.parse(req.body.assignedUsers);
    // console.log(users);

    if (users.length < 1) {
        return next(new ErrorHandler("Please Add Atleast One Users", 400));
    }

    let createdTask = await Task.create({
        title,
        description,
        dueDate,
        assignedUsers: users,
    })

    createdTask = await Task.findById(createdTask._id).populate("assignedUsers", "-password");
    // console.log(createdTask)

    res.status(201).json({
        success: true,
        message: "Task Created Successfully"
    })

});

export const allTasks = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Task.find(), req.query).search().filter();

    let tasks = await apiFeatures.query.populate({
        path: 'assignedUsers',
        select: '-password',
    });

    tasks = tasks.reverse();

    res.status(200).json({
        success: true,
        tasks,
    });
});

export const updateTask = catchAsyncError(async (req, res, next) => {
    const { id, title, description } = req.body;

    let users = JSON.parse(req.body.assignedUsers);

    if (users.length < 1) {
        return next(new ErrorHandler("Please Add Atleast One User", 400));
    }

    let task = await Task.findById(id);

    if (!task) {
        return next(new ErrorHandler("Task Not Found", 404));
    }

    task.title = title;
    task.description = description;
    task.assignedUsers = users;

    await task.save();

    res.status(200).json({
        success: true,
        message: "Task Updated Successfully"
    });
});

export const deleteTask = catchAsyncError(async (req, res, next) => {
    const { id } = req.body;
    let task = await Task.findById(id);

    if (!task) {
        return next(new ErrorHandler("Task Not Found", 404));
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Task Deleted Successfully"
    });
});

export const getStatusTasks = catchAsyncError(async (req, res, next) => {
    const completedTasks = await Task.find({ status: 'complete' }).populate({
        path: 'assignedUsers',
        select: '-password',
    });

    const incompleteTasks = await Task.find({ status: 'incomplete' }).populate({
        path: 'assignedUsers',
        select: '-password',
    });


    res.status(200).json({
        success: true,
        completedTasks,
        incompleteTasks,
    });
});

export const doneCompleteTask = catchAsyncError(async (req, res, next) => {
    const { id, status } = req.body;
    let task = await Task.findById(id);

    if (!task) {
        return next(new ErrorHandler("Task Not Found", 404));
    }

    task.status = status;

    await task.save();

    res.status(200).json({
        success: true,
        task
    });
});

export const myTasks = catchAsyncError(async (req, res, next) => {

    let tasks = await Task.find({ assignedUsers: req.user._id }).populate
        ({
            path: 'assignedUsers',
            select: '-password',
        });

    tasks = tasks.reverse();


    res.status(200).json({
        success: true,
        tasks,
    });
});
