'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RefreshOnFocus() {
    const router = useRouter();
    useEffect(() => {
        const handleFocus = () => {
            router.refresh(); // Invalida el Router Cache y obtiene datos frescos del servidor
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [router]);
    return null;
}

