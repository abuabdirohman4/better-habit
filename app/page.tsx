"use client";
import Button from "@/components/Button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
// import { FcGoogle } from "react-icons/fc";
// import { MdEmail } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getLocal, removeLocal, setLocal } from "@/utils/session";
import { LOCALKEY } from "@/utils/constants";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
// import { signIn, signOut, useSession } from "next-auth/react";

export default function Welcome() {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setshowPassword] = useState<boolean>(false);
    const [form, setForm] = useState<{
        clientid: string;
        password: string;
    }>({
        clientid: "",
        password: "",
    });
    // const { data: session, status } = useSession();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const router = useRouter();

    useEffect(() => {
        // const rememberMe = getLocal(LOCALKEY.rememberMe);
        // if (rememberMe) {
        //     setRememberMe(rememberMe);
        // }
        // const clientid = getLocal(LOCALKEY.clientid);
        // if (clientid) {
        //     setForm({
        //         clientid: clientid,
        //         password: "",
        //     });
        // }
        // setIsLoading(false);// Redirect to dashboard immediately
        router.push("/dashboard");
    }, [router]);

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
                    <div className="flex justify-center my-10">
                        <Image
                            src="/illustration/get-started.svg"
                            width={400}
                            height={500}
                            alt="get started"
                            priority={true}
                        />
                    </div>
                    {/* {session ? (
            <>
              <p>Welcome, {session.user?.name}</p>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Sign in with Google
            </button>
          )} */}

                    {/* <Button color="bg-primary" className="w-full py-3.5">
            <div className="flex justify-center">
              <div className="bg-white inline mr-3 px-1 flex items-center rounded-md">
                <FcGoogle size={18} />
              </div>
              Sign in with Google
            </div>
          </Button>
          <Button color="bg-primary" className="w-full py-3.5 mt-3">
            <div className="flex justify-center">
              <div className="bg-white inline mr-3 px-1 flex items-center rounded-md">
                <MdEmail size={18} color="#1496F6" />
              </div>
              Sign up using Email
            </div>
          </Button>
          <p className="mt-3 flex justify-center">
            Already have an account?
            <button
              className="text-primary font-semibold ml-1"
              onClick={openModal}
            >
              Sign In
            </button>
          </p> */}

                    {rememberMe ? (
                        <Button
                            color="bg-primary"
                            className="w-full py-3.5"
                            onClick={openModal}
                        >
                            Login
                        </Button>
                    ) : (
                        <>
                            <Button
                                color="bg-primary"
                                className="w-full py-3.5"
                            >
                                Get Started
                            </Button>
                            <p className="mt-3 flex justify-center">
                                Already have an account?
                                <button
                                    className="text-primary font-semibold ml-1"
                                    onClick={openModal}
                                >
                                    Sign In
                                </button>
                            </p>
                        </>
                    )}
                </>
            )}

            {/* Modal Login */}
            <dialog
                className="modal backdrop-blur-xl backdrop-brightness-150"
                ref={modalRef}
            >
                <div className="h-full w-full max-w-md px-7 col-start-1 row-start-1 transform rounded-lg px-3.5 mt-5">
                    <form method="dialog" className="flex justify-end">
                        <button className="btn btn-md btn-circle btn-ghost">
                            <FontAwesomeIcon
                                icon={faXmark}
                                size="2xl"
                                color="gray"
                            />
                        </button>
                    </form>
                    <form className="mt-44">
                        <input
                            type="text"
                            name="clientid"
                            onChange={handleChange}
                            value={form.clientid}
                            className="border-2 border-primary text-gray-900 text-sm rounded-full focus:ring-primary focus:border-primary block w-full py-4 px-7 mb-3"
                            placeholder="Clientid"
                            required
                        />
                        <div className="relative flex mb-3">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={handleChange}
                                value={form.password}
                                className="border-2 border-primary text-gray-900 text-sm rounded-full focus:ring-primary focus:border-primary block w-full py-4 px-7"
                                placeholder="Password"
                                required
                            />
                            <div
                                className="absolute right-8 top-4 cursor-pointer"
                                onClick={() => setshowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <RiEyeLine size={20} />
                                ) : (
                                    <RiEyeCloseLine size={20} />
                                )}
                            </div>
                        </div>
                        <div className="flex items-start ml-3 mb-6">
                            <div className="flex items-center h-5">
                                <input
                                    name="remember"
                                    id="remember"
                                    type="checkbox"
                                    value="coba"
                                    checked={rememberMe}
                                    onChange={() => {
                                        if (!rememberMe) {
                                            setLocal(
                                                LOCALKEY.clientid,
                                                form.clientid
                                            );
                                        } else {
                                            removeLocal(LOCALKEY.clientid);
                                        }
                                        setRememberMe(!rememberMe);
                                        setLocal(
                                            LOCALKEY.rememberMe,
                                            !rememberMe
                                        );
                                    }}
                                    className="w-4 h-4 border border-gray-300 rounded-full bg-primary text-primary focus:ring-3 focus:ring-primary"
                                    required
                                />
                            </div>
                            <label
                                htmlFor="remember"
                                className="ms-2 text-sm text-primary font-semibold cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>
                        <Button
                            color="bg-primary"
                            className="w-full p-2.5 py-4"
                        >
                            Login
                        </Button>
                        <Link
                            href="#"
                            className="text-primary font-semibold underline flex justify-center mt-5"
                        >
                            Forgot Password?
                        </Link>
                    </form>
                </div>
            </dialog>
        </main>
    );
}
