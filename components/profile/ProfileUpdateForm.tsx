'use client';

import React, { useRef, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { updateProfileDetails } from '@/actions/profile';
import { UserProfile } from '@/lib/mockData/profile';
import { Loader2, User, Save } from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
}

const initialState: ProfileFormState = {
  success: false,
  message: '',
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const [state, formAction] = useFormState(updateProfileDetails, initialState);
  const [isPending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    startTransition(() => {
        formAction(formData);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-teal-600" />
        Edit Profile Details
      </h3>

      {/* Status Message Display */}
      {state.message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          state.success ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {state.message}
        </div>
      )}

      <form action={handleAction} className="space-y-4">

        {/* Display Name Field */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            defaultValue={profile.displayName}
            disabled={isPending}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition disabled:bg-gray-100"
            placeholder="Your name or nickname"
          />
          {state.errors?.displayName && (
            <p className="mt-1 text-xs text-red-500">{state.errors.displayName.join(', ')}</p>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={profile.bio}
            disabled={isPending}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition disabled:bg-gray-100"
            placeholder="Tell us about yourself and your storefront."
          />
          {state.errors?.bio && (
            <p className="mt-1 text-xs text-red-500">{state.errors.bio.join(', ')}</p>
          )}
        </div>

        <button
            type="submit"
            disabled={isPending}
            className={`
              w-full py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center
              ${isPending 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700'
              }
            `}
          >
            {isPending ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</> : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
          </button>
      </form>
    </div>
  );
};
