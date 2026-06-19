import React from 'react';
import { useCursor } from '../../hooks/useCursor';
import { ArrowUpRight } from 'lucide-react';

const TableRow = ({ item }) => {
  const { cursorHoverProps } = useCursor('Open');
  
  // Format date display (e.g. 2025-12 -> Dec 2025)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (!month) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${months[monthIndex]} ${year}`;
  };

  return (
    <tr 
      {...cursorHoverProps}
      onClick={() => item.link && window.open(item.link, '_blank', 'noopener,noreferrer')}
      style={{ cursor: 'pointer', transition: 'background-color 0.2s', borderBottom: '1px solid rgba(26, 26, 26, 0.08)' }}
      className="table-row-hover"
    >
      <td style={{ padding: '20px 24px', fontWeight: 600, color: '#1A1A1A', fontSize: '0.95rem' }}>
        {item.title}
      </td>
      <td style={{ padding: '20px 24px', color: '#5C5C5C', fontSize: '0.85rem' }}>
        {item.category}
      </td>
      <td style={{ padding: '20px 24px', color: '#5C5C5C', fontSize: '0.85rem', textAlign: 'right' }}>
        {formatDate(item.date)}
      </td>
      <td style={{ padding: '20px 24px', width: '60px', textAlign: 'center' }}>
        <span style={{ color: '#6D28D9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowUpRight size={16} />
        </span>
      </td>
    </tr>
  );
};

export const FeaturedWorksTable = ({ tableData }) => {
  if (!tableData || tableData.length === 0) return null;

  // Sort items by date descending
  const sortedData = [...tableData].sort((a, b) => {
    return new Date(b.date || '') - new Date(a.date || '');
  });

  return (
    <section id="archives" style={{ padding: '5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-eyebrow" style={{ color: '#6D28D9' }}>Archive</span>
          <h2 className="section-title display-font" style={{ color: '#1A1A1A' }}>Projects Directory</h2>
          <p className="section-desc" style={{ color: '#5C5C5C', marginBottom: 0 }}>
            A structured directory of digital experiments, print campaigns, and student activities.
          </p>
        </div>

        <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(26, 26, 26, 0.06)', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(26, 26, 26, 0.08)', background: 'rgba(26, 26, 26, 0.01)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5C5C' }}>Project Title</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5C5C' }}>Category</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5C5C5C', textAlign: 'right' }}>Date</th>
                <th style={{ padding: '16px 24px', width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <TableRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
