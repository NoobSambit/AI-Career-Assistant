interface DiffPair {
  before: string;
  after: string;
}

interface DiffViewProps {
  pairs: DiffPair[];
}

export function DiffView({ pairs }: DiffViewProps): JSX.Element {
  if (!pairs || pairs.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <p>No changes to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-xs font-medium text-red-700 dark:text-red-300 mb-2 uppercase tracking-wide">
              Before
            </div>
            <div className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
              {pair.before}
            </div>
          </div>

          {/* After */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="text-xs font-medium text-green-700 dark:text-green-300 mb-2 uppercase tracking-wide">
              After
            </div>
            <div className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
              {pair.after}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export type { DiffPair, DiffViewProps };
