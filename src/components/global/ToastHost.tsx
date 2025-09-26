interface ToastProps {
  message: string;
  type?: "error" | "success";
}

const Toast = ({ message, type = "error" }: ToastProps) => {
  const color = type === "success" ? "bg-emerald-600" : "bg-red-600";
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white ${color} px-4 py-2 rounded shadow`}
      role="status"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default Toast;
