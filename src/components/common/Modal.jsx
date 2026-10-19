export default function Modal({ open, onClose, title, children, size = 'max-w-md' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg w-full ${size} p-6 lg:ml-[calc(16rem_+_0.5%)] max-h-[92vh] overflow-y-auto w-[95%]`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
