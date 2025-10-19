import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl w-full mx-4 sm:mx-6 md:mx-12 bg-white/80 dark:bg-slate-900/70 backdrop-blur rounded-2xl shadow-lg p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Welcome to the Banking App
          </h1>
          <p className="mt-3 text-slate-700 dark:text-slate-300 max-w-xl">
            Securely manage accounts, transfer funds, and view transaction
            history — all in one place.
          </p>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
            <Link
              href="/register"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
