import { Form, Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <div className="absolute inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-foreground transition-colors duration-300">
            <Head title="Reset password - AuraFit" />

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

            {/* Reset Password Card */}
            <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-panel p-8 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl">
                <Form
                    {...update.form()}
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    className="h-12 rounded-xl border-border bg-card text-foreground placeholder-muted-foreground transition-all focus:border-transparent focus:ring-2 focus:ring-neon-pink"
                                    readOnly
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase"
                                >
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    className="h-12 rounded-xl border-border bg-card text-foreground placeholder-muted-foreground transition-all focus:border-transparent focus:ring-2 focus:ring-neon-pink"
                                    autoFocus
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase"
                                >
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    className="h-12 rounded-xl border-border bg-card text-foreground placeholder-muted-foreground transition-all focus:border-transparent focus:ring-2 focus:ring-neon-pink"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 h-14 w-full transform rounded-xl border-0 bg-gradient-to-r from-neon-pink to-neon-blue text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] disabled:transform-none disabled:opacity-50"
                                disabled={processing}
                                data-test="reset-password-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2 h-5 w-5" />{' '}
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </Button>
                        </div>
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
