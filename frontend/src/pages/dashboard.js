import { useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import withAuth from "../components/withAuth";
import AccountList from "../components/accountList";
import TransactionHistory from "../components/transactionHistory";
import TransferForm from "../components/transferForm";

function DashboardPage() {
  const router = useRouter();
  const { user, logout, token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Pull out fetch functions so we can call them from other handlers (e.g. after a transfer)
  const fetchAccounts = useCallback(async () => {
    try {
      const { getAccounts } = await import("../services/api");
      const data = await getAccounts(token);
      setAccounts(data || []);
      if (data && data.length > 0) {
        // if nothing selected, keep current selection; otherwise keep it
        setSelectedAccountId((prev) => (prev ? prev : data[0].id));
      } else {
        setSelectedAccountId(null);
      }
    } catch (err) {
      console.warn("Failed to load accounts:", err);
    }
  }, [token]);

  const fetchTransactions = useCallback(async (accountId) => {
    if (!accountId) {
      setTransactions([]);
      return;
    }
    try {
      const { getTransactions } = await import("../services/api");
      const tx = await getTransactions(token, accountId);
      setTransactions(tx || []);
    } catch (err) {
      console.warn("Failed to load transactions:", err);
      setTransactions([]);
    }
  }, [token]);

  const handleLogout = () => {
    try {
      logout();
    } finally {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user's accounts once on mount using the token from context
    fetchAccounts();
  }, [router, token, fetchAccounts]);

  // When the selected account changes, fetch transactions for that account
  useEffect(() => {
    if (!selectedAccountId) {
      setTransactions([]);
      return;
    }

    if (!token) {
      // cannot fetch without token
      setTransactions([]);
      return;
    }

    fetchTransactions(selectedAccountId);
  }, [selectedAccountId, token, fetchTransactions]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3">
        <div className="p-8 md:col-span-2">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-sm text-slate-500">
            You have {accounts.length} account{accounts.length !== 1 ? "s" : ""}
            .
          </p>
          <p className="text-sm text-slate-500">
            Selected account ID: {selectedAccountId ?? "None"}
          </p>
          <p className="text-sm text-slate-500">
            Transactions: {transactions.length}
          </p>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Your accounts</h2>
            <AccountList
              accounts={accounts}
              onAccountSelect={(id) => setSelectedAccountId(id)}
            />
          </div>
        </div>
        <div className="p-6 border-l md:col-span-1">
          <div className="mb-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-md bg-red-600 text-white"
            >
              Logout
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-2">Transactions</h2>
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
      <TransferForm
        accounts={accounts}
        onSubmit={async (data) => {
          try {
            const { transferMoney } = await import("../services/api");
            // transferMoney expects (transferData, token)
            await transferMoney(data, token);
            // Show success and refresh accounts + transactions
            alert("Transfer successful!");
            await fetchAccounts();
            // if a selected account exists, refresh its transactions; otherwise refresh the from-account
            const acctForTx = selectedAccountId || data.from_account_id;
            if (acctForTx) await fetchTransactions(acctForTx);
            return;
          } catch (err) {
            console.warn("Transfer failed:", err);
            // normalize backend message and rethrow so the TransferForm can display it
            let msg = err.message;
            if (err.response) {
              if (typeof err.response === "string") msg = err.response;
              else if (err.response.detail) msg = err.response.detail;
              else if (err.response.error) msg = err.response.error;
              else if (err.response.non_field_errors)
                msg = Array.isArray(err.response.non_field_errors)
                  ? err.response.non_field_errors.join(" ")
                  : String(err.response.non_field_errors);
              else msg = JSON.stringify(err.response);
            }
            const e = new Error(msg);
            e.response = err.response;
            throw e;
          }
        }}
      />

    </main>
    
  );
}

export default withAuth(DashboardPage);
