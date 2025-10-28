import styles from "../pages/dashboard.module.css";

export default function TransactionHistory({
  transactions = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div className="mt-4">
        <div className={styles.transactionTableWrap} style={{ padding: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div
                className={`${styles.skeleton} ${styles["skeleton-line"]}`}
                style={{ width: 120 }}
              />
              <div
                className={`${styles.skeleton} ${styles["skeleton-line"]}`}
                style={{ width: 80 }}
              />
              <div
                className={`${styles.skeleton} ${styles["skeleton-line"]}`}
                style={{ width: 180 }}
              />
              <div
                className={`${styles.skeleton} ${styles["skeleton-line"]}`}
                style={{ width: 140 }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-500">No transactions to show.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">
                  Type
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-slate-600">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">
                  Timestamp
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const type =
                  transaction.transaction_type || transaction.type || "";
                const amount = Number(transaction.amount).toFixed(2);
                const ts = transaction.timestamp || transaction.date || "";
                const dateStr = ts ? new Date(ts).toLocaleString() : "";
                const typeClass = type.toLowerCase().includes("deposit")
                  ? "bg-green-100 text-green-800"
                  : type.toLowerCase().includes("withdraw")
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800";

                return (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-800">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeClass}`}
                      >
                        {type || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">
                      ${amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {dateStr}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {transaction.description || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
