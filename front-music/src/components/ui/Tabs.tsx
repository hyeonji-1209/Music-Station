import React, { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'underline';
  rightActions?: ReactNode;
}

function Tabs({
  items,
  activeTab,
  onChange,
  className = '',
  variant = 'default',
  rightActions,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState<string>(
    activeTab || items[0]?.id || ''
  );

  const currentTab = activeTab || internalActiveTab;
  const activeTabContent = items.find((item) => item.id === currentTab)?.content;

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    if (!activeTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div className={`tabs ${className} tabs--${variant}`}>
      <div className="tabs__header">
        {items.map((item) => (
          <button
            key={item.id}
            className={`tabs__tab ${currentTab === item.id ? 'tabs__tab--active' : ''
              } ${item.disabled ? 'tabs__tab--disabled' : ''}`}
            onClick={() => handleTabClick(item.id, item.disabled)}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
        {rightActions && (
          <div className="tabs__actions">
            {rightActions}
          </div>
        )}
      </div>
      {activeTabContent && (
        <div className="tabs__content">{activeTabContent}</div>
      )}
    </div>
  );
}

export default Tabs;

