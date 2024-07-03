import Button from "@/components/Button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-white pt-24 px-7">
      <h1 className="text-4xl font-semibold mx-3">
        Build Small Habits, Build Your{" "}
        <span className="text-primary">Better Self.</span>
      </h1>
      <div className="flex justify-center my-10">
        <Image
          src="/illustration/get-started.svg"
          width={400}
          height={500}
          alt="get started"
          priority={true}
        />
      </div>
      <Button color="bg-primary" className="rounded-3xl w-full py-3.5">
        Get Started
      </Button>
    </main>
  );
}
