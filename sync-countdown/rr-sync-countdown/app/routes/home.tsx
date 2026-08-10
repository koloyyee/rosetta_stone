import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sync Countdown" },
    { name: "description", content: "Real-time synchronized countdown timer" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <a href="/" className="text-amber-800 font-semibold">Home</a>
        <div className="flex gap-4 items-center">
          <a href="/login" className="px-4 py-2 rounded-lg bg-white text-amber-800 border border-amber-300 hover:bg-amber-50 transition">
            Login
          </a>
        </div>
      </nav>

      <div className="max-w-xl mx-auto mt-24 p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4 text-amber-700">
          Welcome to Sync Countdown!
        </h1>
        <p className="mb-6 text-lg text-amber-900">
          Create or join a <strong>virtual room</strong> and synchronize your
          countdown timer with friends, colleagues, or teammates.
        </p>
        <div className="features mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-amber-800">Features</h2>
          <ul className="space-y-2 text-amber-900">
            <li>🕒 Real-time synchronized countdowns</li>
            <li>🔗 Share room links for easy collaboration</li>
            <li>🔒 Private and secure virtual rooms</li>
            <li>🎉 Perfect for online events, study sessions, and more!</li>
          </ul>
        </div>
        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="inline-block px-6 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
          >
            Get Started
          </a>
          <a
            href="/rooms"
            className="inline-block px-6 py-3 rounded-lg border border-amber-500 text-amber-700 font-semibold hover:bg-amber-50 transition"
          >
            Browse Rooms
          </a>
        </div>
      </div>
    </main>
  );
}
