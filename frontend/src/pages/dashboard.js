import { useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import withAuth from "../components/withAuth";
import Link from "next/link";

function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    try {
      logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3">
        <div className="p-8 md:col-span-2">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Welcome back, {user.first_name}!
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-md bg-red-600 text-white"
        >
          Logout
        </button>
      </div>
    </main>
  );
}

export default withAuth(DashboardPage);
