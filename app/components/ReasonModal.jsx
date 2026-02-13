"use client";

export default function ReasonModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Reason for Action</h2>

        <textarea
          className="w-full border rounded p-2 h-28"
          placeholder="Enter the reason for this action..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (reason.trim().length === 0) {
                alert("Please enter a reason.");
                return;
              }
              onSubmit(reason);
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
