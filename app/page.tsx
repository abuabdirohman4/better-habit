"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NavButton from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LANDING_COPY, type Lang } from "@/lib/landing-copy";

export default function Landing() {
    const router = useRouter();
    const [lang, setLang] = useState<Lang>("id");
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const t = LANDING_COPY[lang];

    // User yang sudah login tidak perlu lihat halaman marketing.
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) router.replace("/dashboard");
        });
    }, [router]);

    useEffect(() => {
        const saved = localStorage.getItem("bh-lang");
        if (saved === "id" || saved === "en") setLang(saved);
    }, []);

    const switchLang = (next: Lang) => {
        setLang(next);
        localStorage.setItem("bh-lang", next);
    };

    return (
        <div className="bg-white text-habit-dark">
            {/* Nav */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/img/logo.svg"
                            width={30}
                            height={30}
                            alt="Better Habit"
                        />
                        <span className="text-base font-semibold">
                            Better Habit
                        </span>
                    </div>

                    {/* Anchor links — disembunyikan di mobile, ruang navnya sempit. */}
                    <nav className="hidden items-center gap-6 md:flex">
                        {t.nav.links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-habit-gray transition hover:text-primary"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="flex rounded-full border border-gray-200 p-0.5 text-xs font-medium">
                            {(["id", "en"] as const).map((code) => (
                                <button
                                    key={code}
                                    onClick={() => switchLang(code)}
                                    aria-pressed={lang === code}
                                    className={`rounded-full px-2.5 py-1 transition ${
                                        lang === code
                                            ? "bg-primary text-white"
                                            : "text-habit-gray hover:text-habit-dark"
                                    }`}
                                >
                                    {code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <NavButton
                            href="/signin"
                            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110"
                        >
                            {t.nav.signIn}
                        </NavButton>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto max-w-5xl px-5 pb-16 pt-14 md:pt-20">
                <div className="grid items-center gap-10 md:grid-cols-2">
                    <div>
                        <span className="inline-block rounded-full bg-card-blue px-3 py-1 text-xs font-medium text-primary">
                            {t.hero.badge}
                        </span>
                        <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                            {t.hero.title}{" "}
                            <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
                                {t.hero.titleAccent}
                            </span>
                        </h1>
                        <p className="mt-5 text-base leading-relaxed text-habit-gray">
                            {t.hero.subtitle}
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-4">
                            <NavButton
                                href="/signin"
                                className="rounded-full bg-primary px-6 py-3.5 text-base font-medium text-white hover:brightness-110"
                            >
                                {t.hero.ctaPrimary}
                            </NavButton>
                            <a
                                href="#how"
                                className="text-sm font-medium text-habit-gray underline underline-offset-4 hover:text-primary"
                            >
                                {t.hero.ctaSecondary}
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Image
                            src="/illustration/get-started.svg"
                            width={360}
                            height={450}
                            alt="Better Habit"
                            priority
                            className="h-auto w-full max-w-[320px]"
                        />
                    </div>
                </div>

                {/* Angka fitur nyata — bukan klaim jumlah pengguna. */}
                <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl bg-habit-light-gray px-6 py-7 md:grid-cols-4">
                    {t.stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl font-bold text-primary">
                                {s.value}
                            </p>
                            <p className="mt-1 text-xs text-habit-gray">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Problem */}
            <section className="bg-habit-light-gray py-16">
                <div className="mx-auto max-w-5xl px-5">
                    <h2 className="text-center text-3xl font-bold">
                        {t.problem.title}
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-center text-habit-gray">
                        {t.problem.subtitle}
                    </p>
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {t.problem.items.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl bg-white p-6"
                            >
                                <h3 className="text-lg font-semibold">
                                    {item.title}
                                </h3>
                                <p className="mt-2.5 text-sm leading-relaxed text-habit-gray">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="mx-auto max-w-5xl px-5 py-16">
                <h2 className="text-center text-3xl font-bold">
                    {t.features.title}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-habit-gray">
                    {t.features.subtitle}
                </p>
                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    {t.features.items.map((item, i) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-gray-100 p-6"
                        >
                            <span
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white ${
                                    [
                                        "bg-habit-blue",
                                        "bg-habit-purple",
                                        "bg-habit-orange",
                                        "bg-habit-green",
                                    ][i]
                                }`}
                            >
                                {i + 1}
                            </span>
                            <h3 className="mt-4 text-lg font-semibold">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-habit-gray">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="bg-habit-light-gray py-16">
                <div className="mx-auto max-w-5xl px-5">
                    <h2 className="text-center text-3xl font-bold">
                        {t.how.title}
                    </h2>
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {t.how.steps.map((step, i) => (
                            <div
                                key={step.title}
                                className="rounded-2xl bg-white p-6"
                            >
                                <p className="text-4xl font-bold text-primary/25">
                                    0{i + 1}
                                </p>
                                <h3 className="mt-2 text-lg font-semibold">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-habit-gray">
                                    {step.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tracking */}
            <section className="mx-auto max-w-5xl px-5 py-16">
                <h2 className="text-center text-3xl font-bold">
                    {t.tracking.title}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-habit-gray">
                    {t.tracking.subtitle}
                </p>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {t.tracking.items.map((item, i) => (
                        <div
                            key={item.label}
                            className={`rounded-2xl p-6 ${
                                ["bg-card-blue", "bg-card-green", "bg-card-purple"][i]
                            }`}
                        >
                            <p className="text-sm font-semibold uppercase tracking-wide">
                                {item.label}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-habit-dark/70">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* PWA */}
                <div className="mt-10 rounded-2xl bg-gradient-to-r from-gradient-start to-gradient-end px-7 py-9 text-center text-white">
                    <h3 className="text-2xl font-bold">{t.pwa.title}</h3>
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/85">
                        {t.pwa.body}
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-habit-light-gray py-16">
                <div className="mx-auto max-w-3xl px-5">
                    <h2 className="text-center text-3xl font-bold">
                        {t.faq.title}
                    </h2>
                    <div className="mt-9 space-y-3">
                        {t.faq.items.map((item, i) => (
                            <div
                                key={item.q}
                                className="overflow-hidden rounded-xl bg-white"
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaq(openFaq === i ? null : i)
                                    }
                                    aria-expanded={openFaq === i}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <span className="text-sm font-medium">
                                        {item.q}
                                    </span>
                                    <span
                                        className={`shrink-0 text-lg text-primary transition-transform ${
                                            openFaq === i ? "rotate-45" : ""
                                        }`}
                                    >
                                        +
                                    </span>
                                </button>
                                {openFaq === i && (
                                    <p className="px-5 pb-4 text-sm leading-relaxed text-habit-gray">
                                        {item.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="mx-auto max-w-3xl px-5 py-20 text-center">
                <h2 className="text-3xl font-bold leading-snug md:text-4xl">
                    {t.finalCta.title}
                </h2>
                <p className="mt-4 text-habit-gray">{t.finalCta.body}</p>
                <NavButton
                    href="/signin"
                    className="mt-8 rounded-full bg-primary px-8 py-4 text-base font-medium text-white hover:brightness-110"
                >
                    {t.finalCta.button}
                </NavButton>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-100 py-8">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-5 text-center">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/img/logo.svg"
                            width={22}
                            height={22}
                            alt=""
                        />
                        <span className="text-sm font-semibold">
                            Better Habit
                        </span>
                    </div>
                    <p className="text-xs text-habit-gray">
                        {t.footer.tagline}
                    </p>
                </div>
            </footer>
        </div>
    );
}
