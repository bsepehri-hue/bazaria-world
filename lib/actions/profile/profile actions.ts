"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { UserProfile, mockUserProfile } from '@/lib/mockData/profile';

// Mock state management (in a real app, this would hit Firestore/DB)
let currentUserProfile: UserProfile = { ...mockUserProfile };

/**
 * Server Action to fetch the current user's profile details.
 */
export async function getUserProfile(): Promise<UserProfile> {
  // In a real app: fetch profile linked to the authenticated user ID
  return currentUserProfile;
}

// Schema for updating basic profile details
const ProfileSchema = z.object({
  displayName: z.string().min(3, "Display name is required."),
  bio: z.string().max(500, "Bio cannot exceed 500 characters."),
});

export type ProfileFormState = {
  success: boolean;
  message: string;
  errors?: {
    displayName?: string[];
    bio?: string[];
  };
};

/**
 * Server Action for user to update their display name and bio.
 */
export async function updateProfileDetails(
  prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const validatedFields = ProfileSchema.safeParse({
    displayName: formData.get('displayName'),
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation Failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { displayName, bio } = validatedFields.data;

  // MOCK: Update the global mock state
  currentUserProfile.displayName = displayName;
  currentUserProfile.bio = bio;

  console.log(`[Profile Action] Profile updated for ${displayName}.`);

  // Revalidate the profile page
  revalidatePath('/dashboard/profile');

  return { 
    success: true, 
    message: 'Profile updated successfully!' 
  };
}