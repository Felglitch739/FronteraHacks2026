import { Form, Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <div className="absolute inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-foreground transition-colors duration-300">
            <Head title="Register - AuraFit" />

            {/* Logo Section */}
            <div className="mb-10 text-center">
                <div className="mb-4 flex justify-center">
                    <div className="rounded-2xl bg-gradient-to-br from-neon-pink to-purple-900 p-3 shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                        <Activity className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h1 className="font-tech bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-5xl font-black tracking-tighter text-transparent uppercase">
                    AURAFIT
                </h1>
                <p className="mt-2 text-xs font-medium tracking-wide text-gray-500">
                    TECHNOLOGY IN SERVICE OF PEOPLE
                </p>
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-panel p-8 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="ml-1 text-xs font-bold tracking-widest uppercase"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Full name"
                                        className="h-12 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-neon-pink"
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="ml-1 text-xs font-bold tracking-widest uppercase"
                                    >
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="h-12 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-neon-pink"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="ml-1 text-xs font-bold tracking-widest uppercase"
                                    >
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Password"
                                        className="h-12 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-neon-pink"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="ml-1 text-xs font-bold tracking-widest uppercase"
                                    >
                                        Confirm password
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                        className="h-12 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-neon-pink"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 h-14 w-full transform rounded-xl border-0 bg-gradient-to-r from-neon-pink to-neon-blue text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] disabled:transform-none disabled:opacity-50"
                                    tabIndex={5}
                                    data-test="register-user-button"
                                >
                                    {processing && (
                                        <Spinner className="mr-2 h-5 w-5" />
                                    )}
                                    Create account
                                </Button>
                            </div>

                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <TextLink
                                    href={login()}
                                    tabIndex={6}
                                    className="font-bold text-neon-pink transition-colors hover:text-neon-blue"
                                >
                                    Log in
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* Footer Tag */}
            <div className="mt-10 opacity-30">
                <p className="font-tech text-[10px] tracking-[0.5em] text-gray-500 uppercase">
                    System Status: Operational
                </p>
            </div>
        </div>
    );
}
