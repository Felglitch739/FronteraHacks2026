// Components
import { Form, Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <div className="absolute inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-foreground transition-colors duration-300">
            <Head title="Forgot password - AuraFit" />

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
                <p className="mb-6 text-center text-sm text-muted-foreground">
                    Forgot your password? No problem. Just let us know your
                    email address and we will email you a password reset link
                    that will allow you to choose a new one.
                </p>

                {status && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <Form {...email.form()} className="flex flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="email@example.com"
                                        className="h-12 rounded-xl border-border bg-card text-foreground placeholder-muted-foreground transition-all focus:border-transparent focus:ring-2 focus:ring-neon-pink"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <Button
                                    className="mt-4 h-14 w-full transform rounded-xl border-0 bg-gradient-to-r from-neon-pink to-neon-blue text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] disabled:transform-none disabled:opacity-50"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2 h-5 w-5" />{' '}
                                            Sending...
                                        </>
                                    ) : (
                                        'Email password reset link'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <span>Or, return to </span>
                    <TextLink
                        href={login()}
                        className="font-bold text-neon-blue transition-colors hover:text-cyan-300"
                    >
                        log in
                    </TextLink>
                </div>
            </div>
        </div>
    );
}
