type IdvRow = { country: string; dateTime: string; result: string };

const headers = ["Country + Document + IDV", "Date & Time", "Result"];

export default function IdvHistoryTable({ rows }: { rows: IdvRow[] }) {
  return (
    <div className="rounded-xl border border-line-soft bg-field px-[1.25rem] py-[1.5rem]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line-soft text-[0.8125rem] font-semibold uppercase tracking-wide text-ink">
            <th className="w-[45%] pb-3 font-semibold">{headers[0]}</th>
            <th className="w-[35%] pb-3 font-semibold">{headers[1]}</th>
            <th className="pb-3 font-semibold">{headers[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.dateTime} className="text-base text-ink">
              <td className="pt-5">{row.country}</td>
              <td className="pt-5">{row.dateTime}</td>
              <td className="pt-5 text-muted">{row.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
