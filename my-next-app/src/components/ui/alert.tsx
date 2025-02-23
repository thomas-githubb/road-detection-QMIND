type AlertProps = {
  type: "error" | "success";
  message: string;
};

export default function Alert({ type, message }: AlertProps) {
  const alertStyles =
    type === "error"
      ? "bg-red-100 text-red-700 border-red-500"
      : "bg-green-100 text-green-700 border-green-500";

  return (
    <div
      className={`border-l-4 p-4 rounded-md mb-4 ${alertStyles}`}
      role="alert"
    >
      <p>{message}</p>
    </div>
  );
}
