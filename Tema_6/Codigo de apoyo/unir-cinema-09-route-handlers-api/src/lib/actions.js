'use server';

import { revalidatePath } from 'next/cache';

/**
 * Server Action para invalidar toda la cache de la aplicación
 *
 * revalidatePath('/') con el segundo parámetro 'layout' invalida
 * toda la cache desde la raíz, incluyendo todos los datos cacheados.
 */
export async function invalidateAllCache() {
  console.log('[SERVER ACTION] Invalidando toda la cache...');

  // Invalida toda la cache desde la raíz
  revalidatePath('/', 'layout');

  console.log('[SERVER ACTION] Cache invalidada correctamente');

  return { success: true, timestamp: new Date().toISOString() };
}

