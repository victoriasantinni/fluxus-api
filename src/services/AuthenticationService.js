import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as userRepository from '../repositories/UserRepository.js';
import * as config from '../config/auth.config.js'; 

const SALT_ROUNDS = 10;

export async function register(req) {
    const existingUser = await userRepository.findByEmail(req.email);
    if (existingUser) {
        throw new Error("Email já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(req.password, SALT_ROUNDS);

    const newUser = {
        name: req.name,
        email: req.email,
        password: hashedPassword,
    };
    
    await userRepository.save(newUser);
}

export async function login(req) {
    const user = await userRepository.findByEmail(req.email);

    if (!user) {
        throw new Error("Credenciais inválidas"); 
    }

    const passwordIsValid = await bcrypt.compare(req.password, user.password);

    if (!passwordIsValid) {
        throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRATION_TIME }
    );

    return token;
}