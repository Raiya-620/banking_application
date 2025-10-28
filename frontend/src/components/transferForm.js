import { useState } from "react";

export default function TransferForm({ accounts = [], onSubmit }) {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          try {
            // normalize keys to backend expectation
            await onSubmit({
              from_account_id: Number(fromAccount),
              to_account_id: Number(toAccount),
              amount: parseFloat(amount),
            });
            setFromAccount("");
            setToAccount("");
            setAmount("");
          } catch (err) {
            console.warn("Transfer failed:", err);
            // show specific backend message when available
            setError(err?.message || (err?.response && JSON.stringify(err.response)) || "Transfer failed. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>
            From Account:
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_number ? `•••• ${String(account.account_number).slice(-4)}` : `Account ${account.id}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            To Account:
            <select
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_number ? `•••• ${String(account.account_number).slice(-4)}` : `Account ${account.id}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Transfer"}
        </button>
      </form>
    </div>
  );
}
