export type OutputTab = 'enhanced' | 'ats' | 'improvements' | 'industry' | 'career';

interface OutputTabsProps {
  value: OutputTab;
  onChange: (value: OutputTab) => void;
}

export function OutputTabs({ value, onChange }: OutputTabsProps): JSX.Element {
  const tabs: Array<{ id: OutputTab; label: string }> = [
    { id: 'enhanced', label: 'Enhanced Resume' },
    { id: 'ats', label: 'ATS Analysis' },
    { id: 'improvements', label: 'Improvements' },
    { id: 'industry', label: 'Industry Fit' },
    { id: 'career', label: 'Career Path' },
  ];

  const handleKeyDown = (event: React.KeyboardEvent, tabId: OutputTab) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(tabId);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <nav className="flex space-x-8 overflow-x-auto" aria-label="Output tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            aria-pressed={value === tab.id}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              value === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export type { OutputTabsProps };
