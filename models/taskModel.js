import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a title"],
    },
    description: {
        type: String,
        required: [true, "Please enter a description"],
    },
    dueDate: {
        type: Date,
        required: [true, "Please enter a due date"],
    },
    status: {
        type: String,
        default: "incomplete",
    },
    assignedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export const Task = mongoose.model("Task", schema);