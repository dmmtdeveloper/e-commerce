import prisma from "../prisma-client/client";
import { Request, Response } from "express";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

const serverError = "Service error";
const secret = process.env.JWT_SECRET as string;

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const checkPass = await compare(password, user.password);
    if (!checkPass) return res.status(404).json({ error: "Wrong password" });

    const token = sign({ id: user.id }, secret, {
      expiresIn: "1d",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error", error: serverError });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    if (!user) return res.status(404).json({ error: "User not created" });
    return res
      .status(201)
      .json({ message: "User created successfully", user: user });
  } catch (error) {
    console.log(`Error en createUser ${error}`);
    return res.status(500).json({ error: serverError });
  }
};
