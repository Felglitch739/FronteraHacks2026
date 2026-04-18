import { Form, Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="absolute inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-foreground transition-colors duration-300">
            <Head title="Log in - AuraFit" />

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

            {/* Login Card */}
            <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-panel p-8 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
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
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="h-12 rounded-xl border-border bg-card text-foreground placeholder-muted-foreground transition-all focus:border-transparent focus:ring-2 focus:ring-neon-pink"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-xs text-neon-blue transition-colors hover:text-cyan-300"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-12 rounded-xl border-border bg-card text-foreground transition-all focus:border-transparent focus:ring-2 focus:ring-neon-pink"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="mt-2 flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-border text-foreground data-[state=checked]:border-neon-pink data-[state=checked]:bg-neon-pink"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer text-sm text-muted-foreground"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 h-14 w-full transform rounded-xl border-0 bg-gradient-to-r from-neon-pink to-neon-blue text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] disabled:transform-none disabled:opacity-50"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2 h-5 w-5" />{' '}
                                            Authenticating...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </div>

                            {canRegister && (
                                <div className="mt-4 text-center text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={5}
                                        className="font-bold text-neon-blue transition-colors hover:text-cyan-300"
                                    >
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>

                {status && (
                    <div className="mt-6 rounded-lg border border-green-800/50 bg-green-900/20 p-3 text-center text-sm font-medium text-green-400">
                        {status}
                    </div>
                )}
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
