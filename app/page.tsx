"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { createClient } from "@/lib/supabase/client";

export default function Welcome() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [form, setForm] = useState({ email: "", password: "" });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                router.replace("/dashboard");
            } else {
                setIsLoading(false);
            }
        });
    }, [router, supabase]);

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });

        if (error) {
            setErrorMessage(error.message);
            setIsSubmitting(false);
            return;
        }

        router.replace("/dashboard");
    };

    return (
        <main className="bg-white pt-24 px-7">
            <h1 className="text-4xl font-semibold mx-3">
                Build Small Habits, Build Your{" "}
                <span className="text-primary">Better Self.</span>
            </h1>
            {isLoading ? (
                <div className="flex justify-center">
                    <Spinner className="h-10 w-10 mt-56" />
                </div>
            ) : (
                <>
                    <div className="flex justify-center my-8">
                        <Image
                            src="/illustration/get-started.svg"
                            width={320}
                            height={400}
                            alt="get started"
                            priority={true}
                        />
                    </div>

                    <form onSubmit={handleSignIn}>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className="border-2 border-primary text-gray-900 text-sm rounded-full focus:ring-primary focus:border-primary block w-full py-4 px-7 mb-3"
                            placeholder="Email"
                            required
                        />
                        <div className="relative flex mb-3">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                className="border-2 border-primary text-gray-900 text-sm rounded-full focus:ring-primary focus:border-primary block w-full py-4 px-7"
                                placeholder="Password"
                                required
                            />
                            <div
                                className="absolute right-8 top-4 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <RiEyeLine size={20} />
                                ) : (
                                    <RiEyeCloseLine size={20} />
                                )}
                            </div>
                        </div>

                        {errorMessage && (
                            <p className="text-sm text-red-600 mb-3 px-4">
                                {errorMessage}
                            </p>
                        )}

                        <Button
                            type="submit"
                            color="bg-primary"
                            className="w-full py-3.5"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Pakai akun Better Planner yang sama.
                    </p>
                </>
            )}
        </main>
    );
}
