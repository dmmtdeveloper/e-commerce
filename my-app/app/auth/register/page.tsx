"use client";
import ButtonComponent from "@/app/ui/components/button";
import InputComponent from "@/app/ui/components/inputs";
import LabelComponent from "@/app/ui/components/labels";
import React, { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const url = "http://localhost:4002/api/user";

const RegisterPage: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    id: "",
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const option = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(user),
      };

      const response = await fetch(url, option);
      const data = await response.json();
      console.log({ message: "user created successfully", data });
      return data;
    } catch (error) {
      console.log({ message: "Error creating user", error });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center mt-24">
      <form className="flex flex-col w-1/4" onSubmit={handleSubmit} action="">
        <h1 className="text-slate-900 font-bold text-4xl mb-4">Register</h1>

        <LabelComponent name="username" htmlFor="name" />

        <InputComponent
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          id="name"
        />

        <LabelComponent name="email" htmlFor="name" />
        <InputComponent
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          id="email"
        />
        <LabelComponent name="password" htmlFor="name" />
        <InputComponent
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          id="password"
        />
        <LabelComponent name="confirm password" htmlFor="name" />
        <InputComponent
          type="password"
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleChange}
          id="confirmPassword"
        />

        <button type="submit">register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
