import * as userService from '../services/user.service.js';

export const createUser = async (req, res, next) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
    }

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await userService.login(email, password);
        res.json({ token });
    } catch (error) {
        next(error);
    }
    }

export const getMe = async (req, res, next) => {
    try {
        const user = await userService.getById(req.user.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
    }