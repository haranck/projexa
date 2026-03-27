type Column<T> = {
    key: string
    header: React.ReactNode
    className?: string
    render?: (row: T) => React.ReactNode
}

type TableProps<T> = {
    columns: Column<T>[]
    data: T[]
    emptyText?: string
    isLoading?: boolean
    rowCount?: number
}

export function Table<T>({
    columns,
    data,
    emptyText = "No records found",
    isLoading = false,
    rowCount = 5,
}: TableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-6 py-4 bg-white/2 ${col.className || ""}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                        Array.from({ length: rowCount }).map((_, rowIndex) => (
                            <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                                {columns.map((_, colIndex) => (
                                    <td key={`skeleton-cell-${colIndex}`} className="px-6 py-4">
                                        <div className="h-4 bg-white/10 rounded w-full"></div>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-20 text-center text-zinc-500 font-medium"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="group hover:bg-white/2 transition-colors duration-200"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-6 py-4 text-sm text-zinc-300 ${col.className || ""}`}
                                    >
                                        {col.render
                                            ? col.render(row)
                                            : (row as Record<string, React.ReactNode>)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}