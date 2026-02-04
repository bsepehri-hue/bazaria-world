"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Define the schema for storefront data validation
const StorefrontSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 characters."),
  description: z.string().max(300, "Description cannot exceed 300 characters.").optional(),
  // In a real app, this would be an IPFS CID or CDN URL after upload
  profileDataUri: z.string().url("Profile data URI must be a valid URL.").optional(),
});

export type StorefrontFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    description?: string[];
    profileDataUri?: string[];
  };
};

/**
 * Server Action to validate form data and log the intent before a blockchain transaction.
 * In a production app, this is where you'd handle IPFS uploads or database records.
 * * @param prevState - The previous state of the form (used by useFormState).
 * @param formData - The submitted form data.
 * @returns An object containing the new form state.
 */
export async function createStorefrontAction(
  prevState: StorefrontFormState,
  formData: FormData,
): Promise<StorefrontFormState> {
  const validatedFields = StorefrontSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    profileDataUri: formData.get('profileDataUri') || 'ipfs://placeholder-cid',
  });

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation Failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, profileDataUri } = validatedFields.data;

  try {
    // --- Server-Side Logic (Mocked) ---
    // 1. **Image Upload:** Upload image (if any) to IPFS/S3 and get the URI/CID. (Skipped for this example)
    // 2. **Database Logging:** Log the intent to create a storefront in your private database. (Skipped for this example)
    
    console.log(`[Server Action] Validated data received for: ${name}`);
    console.log(`[Server Action] Next step: Client must execute blockchain transaction.`);

    // Note: We return success here to indicate server validation passed. 
    // The actual blockchain success/failure will be handled client-side.
    revalidatePath('/dashboard/stores');
    
    return { 
      success: true, 
      message: 'Server validation successful. Please confirm transaction in your wallet.' 
    };

  } catch (error) {
    console.error('Server Action Error:', error);
    return {
      success: false,
      message: 'A critical server error occurred during processing.',
    };
  }
}
