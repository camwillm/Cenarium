export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4 py-12">
      <section className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-8 max-w-xl text-center">
        <h1 className="text-5xl font-extrabold text-blue-400 mb-6 tracking-tight">
          Welcome to Cenarium
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Plan smarter. Eat better. Track your meals and macros with real-time grocery costs and nutritional insights.
        </p>

        <Button label="Get Started" onClick={() => alert("Tailwind is working!")} />
      </section>
    </main>
  );
}

function Button({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white shadow-md transition duration-300"
    >
      {label}
    </button>
  );
}
