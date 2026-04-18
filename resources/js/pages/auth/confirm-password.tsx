import { Form, Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <div className="absolute inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-foreground transition-colors duration-300">
            <Head title="Confirm password - AuraFit" />

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

            {/* Confirm Password Card */}
            <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-panel p-8 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl">
                <p className="mb-4 text-center text-sm text-muted-foreground">
                    This is a secure area of the application. Please confirm
                    your password before continuing.
                </p>
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-6">
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
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    autoFocus
                                    className="h-12 rounded-xl border-border bg-card text-foreground transition-all focus:border-transparent focus:ring-2 focus:ring-neon-pink"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <Button
                                className="mt-4 h-14 w-full transform rounded-xl border-0 bg-gradient-to-r from-neon-pink to-neon-blue text-sm font-bold tracking-widest text-primary-foreground uppercase shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] disabled:transform-none disabled:opacity-50"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2 h-5 w-5" />{' '}
                                        Confirming...
                                    </>
                                ) : (
                                    'Confirm password'
                                )}
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}
