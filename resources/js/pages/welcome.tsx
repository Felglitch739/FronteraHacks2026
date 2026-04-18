import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Dumbbell,
    LayoutDashboard,
    ShieldAlert,
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

                <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-10">
                    <header className="glass-panel mb-6 flex flex-col items-start gap-3 rounded-2xl border border-glass-border bg-glass-panel px-3 py-3 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:px-4">
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

                        <nav className="flex w-full flex-wrap items-center justify-end gap-2 text-sm sm:w-auto sm:gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-full border border-neon-blue/25 bg-neon-blue/10 px-3 py-1.5 font-semibold text-neon-blue/80 transition hover:border-neon-blue/50 hover:bg-neon-blue/15 sm:px-4 sm:py-2"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 font-semibold text-foreground transition hover:border-neon-pink/30 hover:bg-accent/50 sm:px-4 sm:py-2"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-full border border-neon-pink/30 bg-linear-to-r from-neon-pink to-neon-blue px-3 py-1.5 font-semibold text-foreground shadow-[0_0_24px_var(--color-neon-pink)/10] transition hover:scale-[1.02] sm:px-4 sm:py-2"
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
                            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-neon-pink/20 blur-3xl" />
                            <div className="absolute -right-10 bottom-6 h-36 w-36 rounded-full bg-neon-blue/20 blur-3xl" />

                            <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/40 p-8 shadow-[0_0_50px_rgba(59,130,246,0.12)] backdrop-blur-xl">
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.04))]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.14),transparent_34%)]" />

                                <div className="relative z-10 flex items-center justify-between gap-4 border-b border-gray-800 pb-4">
                                    <div>
                                        <p className="text-xs tracking-[0.32em] text-neon-blue/80 uppercase">
                                            Recovery intelligence
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-foreground">
                                            AI Recovery Heatmap
                                        </h2>
                                    </div>
                                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-right shadow-[0_0_24px_rgba(239,68,68,0.18)]">
                                        <p className="text-xs tracking-[0.25em] text-red-300 uppercase">
                                            Intervention
                                        </p>
                                        <p className="text-2xl font-black text-red-400">
                                            Critical
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
                                    <div className="flex-1">
                                        <svg
                                            className="h-64 w-full max-w-xl drop-shadow-[0_0_28px_rgba(59,130,246,0.25)]"
                                            viewBox="0 0 420 420"
                                            fill="none"
                                            aria-label="Human recovery heatmap"
                                            role="img"
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="torsoGlow"
                                                    x1="0"
                                                    x2="1"
                                                    y1="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="rgb(34 211 238)"
                                                        stopOpacity="0.9"
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="rgb(59 130 246)"
                                                        stopOpacity="0.75"
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="legGlow"
                                                    x1="0"
                                                    x2="1"
                                                    y1="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="rgb(239 68 68)"
                                                        stopOpacity="1"
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="rgb(127 29 29)"
                                                        stopOpacity="0.9"
                                                    />
                                                </linearGradient>
                                            </defs>

                                            <circle
                                                cx="210"
                                                cy="72"
                                                r="34"
                                                stroke="url(#torsoGlow)"
                                                strokeWidth="8"
                                                className="drop-shadow-[0_0_18px_rgba(59,130,246,0.5)]"
                                            />
                                            <path
                                                d="M210 106V188"
                                                stroke="url(#torsoGlow)"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_18px_rgba(59,130,246,0.5)]"
                                            />
                                            <path
                                                d="M162 142L116 178"
                                                stroke="url(#torsoGlow)"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_18px_rgba(59,130,246,0.5)]"
                                            />
                                            <path
                                                d="M258 142L304 178"
                                                stroke="url(#torsoGlow)"
                                                strokeWidth="10"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_18px_rgba(59,130,246,0.5)]"
                                            />
                                            <path
                                                d="M210 188L164 270"
                                                stroke="url(#legGlow)"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                            />
                                            <path
                                                d="M210 188L256 270"
                                                stroke="url(#legGlow)"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                            />
                                            <path
                                                d="M164 270L146 360"
                                                stroke="url(#legGlow)"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                            />
                                            <path
                                                d="M256 270L274 360"
                                                stroke="url(#legGlow)"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                            />

                                            <path
                                                d="M145 232H275"
                                                stroke="rgb(239 68 68)"
                                                strokeWidth="18"
                                                strokeLinecap="round"
                                                opacity="0.45"
                                                className="drop-shadow-[0_0_18px_rgba(239,68,68,0.85)]"
                                            />
                                            <path
                                                d="M138 306H284"
                                                stroke="rgb(239 68 68)"
                                                strokeWidth="16"
                                                strokeLinecap="round"
                                                opacity="0.38"
                                                className="drop-shadow-[0_0_18px_rgba(239,68,68,0.85)]"
                                            />

                                            <circle
                                                cx="164"
                                                cy="270"
                                                r="13"
                                                fill="rgb(239 68 68)"
                                                opacity="0.95"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                                            />
                                            <circle
                                                cx="256"
                                                cy="270"
                                                r="13"
                                                fill="rgb(239 68 68)"
                                                opacity="0.95"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                                            />
                                            <circle
                                                cx="146"
                                                cy="360"
                                                r="11"
                                                fill="rgb(239 68 68)"
                                                opacity="0.9"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                                            />
                                            <circle
                                                cx="274"
                                                cy="360"
                                                r="11"
                                                fill="rgb(239 68 68)"
                                                opacity="0.9"
                                                className="drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                                            />

                                            <text
                                                x="52"
                                                y="232"
                                                fill="rgb(239 68 68)"
                                                fontSize="16"
                                                fontWeight="700"
                                            >
                                                Quads
                                            </text>
                                            <text
                                                x="52"
                                                y="312"
                                                fill="rgb(239 68 68)"
                                                fontSize="16"
                                                fontWeight="700"
                                            >
                                                Hamstrings
                                            </text>
                                            <text
                                                x="286"
                                                y="232"
                                                fill="rgb(239 68 68)"
                                                fontSize="16"
                                                fontWeight="700"
                                            >
                                                Fatigue spikes
                                            </text>
                                        </svg>
                                    </div>

                                    <div className="relative w-full max-w-sm lg:mb-20 lg:-ml-8">
                                        <div className="rounded-xl border border-red-500/30 bg-gray-950/80 p-4 shadow-[0_0_28px_rgba(239,68,68,0.16)] backdrop-blur-md">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.25)]">
                                                    <ShieldAlert className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs tracking-[0.28em] text-red-300 uppercase">
                                                        AuraFit AI: Intervention
                                                    </p>
                                                    <p className="mt-2 text-sm leading-6 text-gray-100/90">
                                                        Severe fatigue detected
                                                        in your quadriceps
                                                        following yesterday's
                                                        high-intensity session.
                                                        To protect your
                                                        recovery, your planned
                                                        training for today has
                                                        been automatically
                                                        adapted to Upper Body /
                                                        Active Recovery.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
                                            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                                                <p className="text-xs tracking-[0.25em] text-neon-blue/80 uppercase">
                                                    AI action
                                                </p>
                                                <p className="mt-2 text-foreground">
                                                    Lower-body load is
                                                    suppressed, while upper-body
                                                    work and mobility remain
                                                    active.
                                                </p>
                                            </div>
                                            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                                                <p className="text-xs tracking-[0.25em] text-red-300 uppercase">
                                                    Recovery status
                                                </p>
                                                <p className="mt-2 text-foreground">
                                                    Quadriceps and hamstrings
                                                    show critical accumulation.
                                                    The system is steering you
                                                    toward restoration, not
                                                    intensity.
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
