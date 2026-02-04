import React from "react";
import { FormWrapper } from "./FormWrapper";
import { AccountSettings } from "@/lib/settings/settings";
import { updateAccountSettings } from "@/actions/settings/updateAccountSettings";
import { SettingsFormState } from "@/lib/settings/types";

interface AccountSectionProps {
  settings: AccountSettings;
  userId: string;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

export const AccountSection: React.FC<AccountSectionProps> = ({
  settings,
  userId,
}) => {
  const initialState: SettingsFormState = { success: false, message: "" };

  return (
    <FormWrapper
      action={updateAccountSettings}
      initialState={initialState}
      title="Account & Language Settings"
      description="Manage your display name, bio, and preferred language."
    >
      <form className="space-y-6">
        {/* Required for Firestore update */}
        <input type="hidden" name="userId" value={userId} />

        {/* Display Name Field */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            defaultValue={settings.displayName}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Bio Field */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={settings.bio}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Language Selector */}
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Language
          </label>
          <select
            id="language"
            name="language"
            defaultValue={settings.language}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          Save Account Settings
        </button>
      </form>
    </FormWrapper>
  );
};
