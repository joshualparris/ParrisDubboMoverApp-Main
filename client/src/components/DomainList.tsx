import * as React from 'react';
import type { Domain } from '../types/api';

interface DomainListProps {
  domains: Domain[];
  selectedDomainId: number | null;
  onSelectDomain: (domain: Domain) => void;
}

export function DomainList({ domains, selectedDomainId, onSelectDomain }: DomainListProps) {
  return (
    <div className="domain-list">
      <h3>Domains</h3>
      <ul>
        {domains.map((domain) => (
          <li key={domain.id}>
            <button
              className={domain.id === selectedDomainId ? 'selected' : ''}
              onClick={() => onSelectDomain(domain)}
            >
              {domain.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
