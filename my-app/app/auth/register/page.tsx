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
      <form className="flex flex-col" onSubmit={handleSubmit} action="">
        <LabelComponent name="username" />
        <InputComponent
          type="text"
          name="name"
          id="name"
          value={user.name}
          onChange={handleChange}
        />

        <LabelComponent name="email" />
        <InputComponent
          type="email"
          name="email"
          id="email"
          value={user.email}
          onChange={handleChange}
        />

        <LabelComponent name="Password" />
        <InputComponent
          type="password"
          name="password"
          id="password"
          value={user.password}
          onChange={handleChange}
        />

        <LabelComponent name="Confirm password" />
        <InputComponent
          type="password"
          name="ConfirmPassword"
          id="ConfirmPassword"
          value={user.password}
          onChange={handleChange}
        />

        <ButtonComponent text="Register" />
      </form>
    </div>
  );
};

export default RegisterPage;
