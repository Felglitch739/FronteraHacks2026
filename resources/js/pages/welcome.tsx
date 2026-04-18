import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Dumbbell,
    LayoutDashboard,
    Sparkles,
    UserRound,
    Zap,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

const pillars = [
    {
        icon: Sparkles,
        title: 'Empathetic AI',
        description:
            'Recommendations that prioritize recovery, consistency, and wellness.',
    },
    {
        icon: Activity,
        title: 'Daily check-in',
        description:
            'Adjust your day based on sleep, fatigue, and mental stress.',
    },
    {
        icon: Dumbbell,
        title: 'Guided routines',
        description:
            'Concrete suggestions to train without overloading your body.',
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<{ auth: { user?: { name?: string } | null } }>()
        .props;
    const userName = auth.user?.name ?? 'Athlete';

    const primaryAction = auth.user ? dashboard() : login();
    const primaryLabel = auth.user ? 'Go to dashboard' : 'Log in';

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@500;700;900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-neon-pink),transparent_30%),radial-gradient(circle_at_top_right,var(--color-neon-blue),transparent_26%),linear-gradient(180deg,var(--color-background)_0%,transparent_45%,var(--color-background)_100%)] opacity-20" />
                <div className="absolute inset-0 bg-[linear-gradient(var(--color-foreground)_1px,transparent_1px)] bg-size-[56px_56px] opacity-[0.03]" />

                <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-10">
                    <header className="glass-panel mb-8 flex items-center justify-between rounded-2xl border border-glass-border bg-glass-panel px-4 py-3 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neon-pink/30 bg-linear-to-br from-neon-pink/25 via-neon-blue/15 to-background shadow-[0_0_24px_var(--color-neon-pink)/10]">
                                <Zap className="h-5 w-5 text-neon-pink" />
                            </div>
                            <div>
                                <p className="font-['Orbitron',sans-serif] text-xs tracking-[0.35em] text-neon-blue/80 uppercase">
                                    AuraFit
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Social good fitness intelligence
                                </p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-full border border-neon-blue/25 bg-neon-blue/10 px-4 py-2 font-semibold text-neon-blue/80 transition hover:border-neon-blue/50 hover:bg-neon-blue/15"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 font-semibold text-foreground transition hover:border-neon-pink/30 hover:bg-accent/50"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-full border border-neon-pink/30 bg-linear-to-r from-neon-pink to-neon-blue px-4 py-2 font-semibold text-foreground shadow-[0_0_24px_var(--color-neon-pink)/10] transition hover:scale-[1.02]"
                                        >
                                            Create account
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="grid flex-1 items-center gap-10 pb-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
                        <section className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase backdrop-blur-md">
                                <Sparkles className="h-4 w-4 text-neon-pink" />
                                Technology at the service of your wellbeing
                            </div>

                            <div className="space-y-5">
                                <p className="text-sm font-medium text-neon-blue/80">
                                    Hello, {userName}
                                </p>
                                <h1 className="max-w-2xl bg-linear-to-r from-neon-pink via-foreground to-neon-blue bg-clip-text font-['Orbitron',sans-serif] text-4xl font-black tracking-[0.12em] text-transparent uppercase md:text-6xl">
                                    Train with data, rest with intention.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                    A visual dashboard experience to evaluate
                                    your energy, adjust your routine, and
                                    sustain progress without losing sight of
                                    mental and physical health.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={primaryAction}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-neon-pink to-neon-blue px-6 py-3.5 font-semibold text-foreground shadow-[0_0_30px_var(--color-neon-pink)/25] transition hover:scale-[1.01]"
                                >
                                    {primaryLabel}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                {!auth.user && canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/50 px-6 py-3.5 font-semibold text-foreground backdrop-blur-md transition hover:border-neon-blue/30 hover:bg-accent/50"
                                    >
                                        Open account
                                    </Link>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                {pillars.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <article
                                            key={item.title}
                                            className="rounded-3xl border border-border bg-card/50 p-4 shadow-sm backdrop-blur-xl"
                                        >
                                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-neon-pink/20 bg-neon-pink/10 text-neon-pink">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h2 className="text-sm font-semibold text-foreground">
                                                {item.title}
                                            </h2>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="relative">
                            <div className="absolute -top-8 -left-8 h-28 w-28 rounded-full bg-neon-pink/20 blur-3xl" />
                            <div className="absolute -right-6 bottom-6 h-32 w-32 rounded-full bg-neon-blue/20 blur-3xl" />

                            <div className="glass-panel relative overflow-hidden rounded-4xl border border-glass-border bg-glass-panel p-5 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-2xl">
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.04))]" />

                                <div className="relative flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <p className="text-xs tracking-[0.32em] text-muted-foreground uppercase">
                                            Energy snapshot
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-foreground">
                                            Today's readiness
                                        </h2>
                                    </div>
                                    <div className="rounded-2xl border border-neon-blue/20 bg-neon-blue/10 px-3 py-2 text-right">
                                        <p className="text-xs tracking-[0.25em] text-neon-blue/80 uppercase">
                                            Readiness
                                        </p>
                                        <p className="text-2xl font-black text-neon-blue/80">
                                            86%
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-5 grid gap-4 md:grid-cols-[0.92fr_1.08fr]">
                                    <div className="rounded-[1.6rem] border border-border bg-background/60 p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[conic-gradient(from_180deg,var(--color-neon-pink)_0%,var(--color-neon-blue)_72%,transparent_72%)] p-2 shadow-[0_0_30px_var(--color-neon-blue)/18]">
                                                <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                                                    <div className="text-center">
                                                        <p className="font-['Orbitron',sans-serif] text-3xl font-black text-foreground">
                                                            86
                                                        </p>
                                                        <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                                                            score
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-foreground">
                                                    Steady rhythm
                                                </p>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    You have room to push hard
                                                    today, but the system will
                                                    keep prioritizing your
                                                    recovery if signals change.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 grid gap-3 text-sm">
                                            <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 px-4 py-3">
                                                <span className="flex items-center gap-2 text-muted-foreground">
                                                    <BarChart3 className="h-4 w-4 text-neon-pink" />
                                                    Weekly progress
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    +12%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 px-4 py-3">
                                                <span className="flex items-center gap-2 text-muted-foreground">
                                                    <CheckCircle2 className="h-4 w-4 text-neon-blue/80" />
                                                    Active check-in
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    Ready
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-[1.6rem] border border-border bg-card/50 p-5">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-foreground">
                                                    Your flow today
                                                </p>
                                                <UserRound className="h-4 w-4 text-neon-pink" />
                                            </div>
                                            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                                                <div className="flex gap-3 rounded-2xl border border-border/50 bg-background/40 p-3">
                                                    <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-neon-pink shadow-[0_0_10px_var(--color-neon-pink)/70]" />
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            1. Measure your
                                                            state
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            Sleep, fatigue and
                                                            stress in a single
                                                            check-in.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 rounded-2xl border border-border/50 bg-background/40 p-3">
                                                    <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-neon-blue shadow-[0_0_10px_var(--color-neon-blue)/70]" />
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            2. Receive the
                                                            adaptation
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            The routine changes
                                                            according to your
                                                            real capacity of the
                                                            day.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 rounded-2xl border border-border/50 bg-background/40 p-3">
                                                    <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            3. Execute with calm
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            Train hard when it's
                                                            time, rest when it's
                                                            convenient.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-[1.4rem] border border-border bg-background/60 p-4">
                                                <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
                                                    Focus
                                                </p>
                                                <p className="mt-2 text-lg font-semibold text-foreground">
                                                    Training
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Strength + recovery
                                                </p>
                                            </div>
                                            <div className="rounded-[1.4rem] border border-border bg-background/60 p-4">
                                                <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
                                                    Mode
                                                </p>
                                                <p className="mt-2 text-lg font-semibold text-foreground">
                                                    Guided AI
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Empathetic & precise
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
