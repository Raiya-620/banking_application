export default function AccountList({
  accounts = [],
  onAccountSelect = () => {},
}) {
  return (
    <ul className="space-y-2">
      {accounts.map((account) => (
        <li key={account.id}>
          <button
            type="button"
            onClick={() => onAccountSelect(account.id)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 flex justify-between items-center"
          >
            <div>
              <div className="font-medium text-slate-800">
                Account {account.account_number}
              </div>
              <div className="text-sm text-slate-500">ID: {account.id}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-900">
                ${Number(account.balance).toFixed(2)}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
