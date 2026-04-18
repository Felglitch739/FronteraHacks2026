import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as
    | string
    | undefined;

declare global {
    interface Window {
        aurafitEnablePushNotifications?: () => Promise<boolean>;
    }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

async function syncPushSubscription(
    subscription: PushSubscription,
): Promise<void> {
    const csrf = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    await fetch('/push-subscriptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
        },
        credentials: 'same-origin',
        body: JSON.stringify(subscription.toJSON()),
    });
}

async function registerPushSubscription(
    registration: ServiceWorkerRegistration,
    shouldRequestPermission = false,
): Promise<void> {
    if (!vapidPublicKey) {
        return;
    }

    if (!('Notification' in window)) {
        return;
    }

    if (Notification.permission === 'default' && shouldRequestPermission) {
        const result = await Notification.requestPermission();

        if (result !== 'granted') {
            return;
        }
    }

    if (Notification.permission !== 'granted') {
        return;
    }

    const existingSubscription =
        await registration.pushManager.getSubscription();

    if (existingSubscription) {
        await syncPushSubscription(existingSubscription);
        return;
    }

    const createdSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            vapidPublicKey,
        ) as unknown as BufferSource,
    });

    await syncPushSubscription(createdSubscription);
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(async (registration) => {
                console.log('[PWA] Service Worker registered:', registration);

                window.aurafitEnablePushNotifications = async () => {
                    try {
                        await registerPushSubscription(registration, true);
                        return Notification.permission === 'granted';
                    } catch (error) {
                        console.log(
                            '[PWA] Manual push subscription failed:',
                            error,
                        );
                        return false;
                    }
                };

                try {
                    await registerPushSubscription(registration, false);
                } catch (error) {
                    console.log('[PWA] Push subscription sync failed:', error);
                }
            })
            .catch((error) => {
                console.log('[PWA] Service Worker registration failed:', error);
            });
    });
}
