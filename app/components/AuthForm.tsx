"use client"
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";
import { useMyContext } from "../context/userDataContext";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface UserData {
    id?: string;
    name: string;
    email: string;
    password: string;
}


export default function AuthForm() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("register");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [name, setName] = useState("");
    const { setUser } = useMyContext()

    const userSchema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().required(),
        password: yup.string().required(),
    })

    const { register, handleSubmit } = useForm({
        resolver: yupResolver(userSchema)
    })

    const handleSignIn = async (data: UserData) => {
        const { error } = await authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
                callbackURL: "/",
            },
            {
                onError: (ctx) => alert(ctx.error.message),
            }
        );

        if (!error) router.push("/");
    };

    const handleSignUp = async (data: UserData) => {
        const { data: userDataBetterAuth, error } = await authClient.signUp.email(
            {
                email: data.email,
                password: data.password,
                name: data.name,
                callbackURL: "/",
            },
            {
                onError: (ctx) => alert(ctx.error.message),
            }

        );

        if (userDataBetterAuth?.user) {
            const { id, name, email } = userDataBetterAuth.user;
            const user: UserData = { id, name, email, password: data.password };
            console.log(user);
            
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        }

        if (!error) {
            console.log(data);

            router.push("/");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
                {mode === "login" ? "Sign In" : "Sign Up"}
            </h2>
            <form onSubmit={handleSubmit(mode === "login" ? handleSignIn : handleSignUp)}>
                {mode === "register" && (
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-2 w-full mb-3"
                        {...register('name')}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3"
                    {...register('email')}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-3"
                    {...register('password')}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 w-full rounded cursor-pointer"
                >
                    {mode === "login" ? "Sign In" : "Sign Up"}
                </button>
            </form>


            <p className="mt-4 text-sm text-center">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                >
                    {mode === "login" ? "Register" : "Login"}
                </button>
            </p>

        </div>
    );
}
