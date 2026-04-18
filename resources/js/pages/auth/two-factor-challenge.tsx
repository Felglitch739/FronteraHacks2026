import { Activity } from 'lucide-react';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'login using an authentication code',
            };
        }

        return {
            title: 'Authentication code',
            description:
                'Enter the authentication code provided by your authenticator application.',
            toggleText: 'login using a recovery code',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <div className="absolute inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 text-foreground transition-colors duration-300">
            <Head title="Two-factor authentication" />

            <div className="mb-8 flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink to-neon-blue shadow-[0_0_20px_var(--color-neon-pink)/30]">
                    <Activity className="h-6 w-6 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-neon-pink via-purple-500 to-neon-blue bg-clip-text text-3xl font-black text-transparent">
                    AuraFit
                </h1>
                <h2 className="text-xl font-semibold text-foreground/90">
                    {authConfigContent.title}
                </h2>
            </div>

            <div className="w-full max-w-md rounded-3xl border border-glass-border bg-glass-panel p-8 shadow-[0_0_40px_var(--color-neon-pink)/10] backdrop-blur-xl">
                <p className="mb-6 text-center text-sm text-muted-foreground">
                    {authConfigContent.description}
                </p>
                <div className="space-y-6">
                    <Form
                        {...store.form()}
                        className="space-y-4"
                        resetOnError
                        resetOnSuccess={!showRecoveryInput}
                    >
                        {({ errors, processing, clearErrors }) => (
                            <>
                                {showRecoveryInput ? (
                                    <>
                                        <Input
                                            name="recovery_code"
                                            type="text"
                                            placeholder="Enter recovery code"
                                            autoFocus={showRecoveryInput}
                                            required
                                            className="border-glass-border bg-black/40 text-foreground placeholder:text-muted-foreground/50 focus:border-neon-pink focus:ring-neon-pink/20"
                                        />
                                        <InputError
                                            message={errors.recovery_code}
                                        />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                        <div className="flex w-full items-center justify-center">
                                            <InputOTP
                                                name="code"
                                                maxLength={OTP_MAX_LENGTH}
                                                value={code}
                                                onChange={(value) =>
                                                    setCode(value)
                                                }
                                                disabled={processing}
                                                pattern={REGEXP_ONLY_DIGITS}
                                                className="border-glass-border bg-black/40 text-foreground"
                                            >
                                                <InputOTPGroup>
                                                    {Array.from(
                                                        {
                                                            length: OTP_MAX_LENGTH,
                                                        },
                                                        (_, index) => (
                                                            <InputOTPSlot
                                                                key={index}
                                                                index={index}
                                                                className="border-glass-border bg-black/40 focus:border-neon-pink focus:ring-neon-pink/20"
                                                            />
                                                        ),
                                                    )}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                        <InputError message={errors.code} />
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-neon-pink to-neon-blue text-white transition-opacity hover:opacity-90"
                                    disabled={processing}
                                >
                                    Continue
                                </Button>

                                <div className="mt-4 text-center text-sm text-muted-foreground">
                                    <span>or you can </span>
                                    <button
                                        type="button"
                                        className="cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        onClick={() =>
                                            toggleRecoveryMode(clearErrors)
                                        }
                                    >
                                        {authConfigContent.toggleText}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
