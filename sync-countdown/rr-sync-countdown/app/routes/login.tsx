import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Sync Countdown" },
  ];
}

export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-amber-700 mb-6 text-center">Sign In</h2>
        <p className="text-gray-500 text-center mb-4">
          Login functionality coming soon — use the Angular frontend for now.
        </p>
        <div className="flex justify-center mt-6">
          <a href="/" className="text-amber-700 hover:text-amber-800 underline">Go Home</a>
        </div>
      </div>
    </main>
  );
}
