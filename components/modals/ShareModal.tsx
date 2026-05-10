import React from "react";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  storeName: string;
  storeUrl: string;
};

export function ShareModal({ open, onClose, storeName, storeUrl }: ShareModalProps) {
  if (!open) return null;

  const copyLink = async () => {
    await navigator.clipboard.writeText(storeUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Share {storeName}</h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={copyLink}
            className="w-full bg-teal-600 text-white py-2 rounded-lg"
          >
            Copy Link
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
