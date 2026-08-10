import type { Route } from "./+types/rooms";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rooms - Sync Countdown" },
  ];
}

export default function Rooms() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
      <nav className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <a href="/" className="text-amber-800 font-semibold hover:text-amber-900">&larr; Home</a>
      </nav>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-4">Browse Rooms</h1>
        <p className="text-gray-500">
          Room listing coming soon — use the Angular frontend for now.
        </p>
      </div>
    </main>
  );
}
