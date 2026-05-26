import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-2">Not Found</h2>
      <p className="mb-4">Could not find requested resource in this section</p>
      <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
    </div>
  );
}
