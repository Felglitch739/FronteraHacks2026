// Components
import { Form, Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <div className="absolute inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-foreground transition-colors duration-300">
            <Head title="Email verification - AuraFit" />

            {/* Logo Section */}
            <div className="mb-10 text-center">
                <div className="mb-4 flex justify-center">
                    <div className="rounded-2xl bg-gradient-to-br from-neon-pink to-neon-blue p-3 shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                        <Activity className="h-10 w-10 text-primary-foreground" />
                    </div>
                </div>
                <h1 className="font-tech bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-5xl font-black tracking-tighter text-transparent uppercase">
                    AURAFIT
                </h1>
                <p className="mt-2 text-xs font-medium tracking-wide text-muted-foreground">
                    TECHNOLOGY IN SERVICE OF PEOPLE
                </p>
            </div>

            {/* Card wrapper */}
            <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-panel p-8 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl">
                <div className="mb-6 text-center text-sm text-muted-foreground">
                    Thanks for signing up! Before getting started, could you
                    verify your email address by clicking on the link we just
                    emailed to you? If you didn't receive the email, we will
                    gladly send you another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 rounded-lg border border-green-800/50 bg-green-900/20 p-3 text-center text-sm font-medium text-green-400">
                        A new verification link has been sent to the email
                        address you provided during registration.
                    </div>
                )}

                <Form {...send.form()} className="space-y-6 text-center">
                    {({ processing }) => (
                        <>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-14 w-full transform rounded-xl border-0 bg-gradient-to-r from-neon-pink to-neon-blue text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] disabled:transform-none disabled:opacity-50"
                            >
                                {processing && (
                                    <Spinner className="mr-2 h-5 w-5" />
                                )}
                                Resend verification email
                            </Button>

                            <div className="mt-4 text-center">
                                <TextLink
                                    href={logout()}
                                    className="font-bold text-neon-blue transition-colors hover:text-cyan-300"
                                >
                                    Log out
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* Footer Tag */}
            <div className="mt-10 opacity-30">
                <p className="font-tech text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
                    System Status: Operational
                </p>
            </div>
        </div>
    );
}
