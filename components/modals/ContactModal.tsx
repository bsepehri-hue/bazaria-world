import React from "react";
import { useRouter } from "next/navigation";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  storeName: string;
  storeId: string;
};

export function ContactModal({ open, onClose, storeName, storeId }: ContactModalProps) {
  const router = useRouter();

  if (!open) return null;

  const goToMessages = () => {
    router.push(`/dashboard/messages/new?to=${storeId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Contact {storeName}</h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={goToMessages}
            className="w-full bg-teal-600 text-white py-2 rounded-lg"
          >
            Start Conversation
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
