import React, { useState } from 'react';
import { useCursor } from '../../hooks/useCursor';
import { ArrowUpRight, Search, Calendar, FolderGit2 } from 'lucide-react';

const TableRow = ({ item }) => {
  const { cursorHoverProps } = useCursor('Open');
  const tItem = item || {};
  
  const formatDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const [year, month] = dateStr.split('-');
    if (!month) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return months[monthIndex] ? `${months[monthIndex]} ${year}` : dateStr;
  };

  const handleRowAction = () => {
    if (tItem.link) {
      window.open(tItem.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <tr 
      {...cursorHoverProps}
      tabIndex={tItem.link ? 0 : undefined}
      role={tItem.link ? 'link' : undefined}
      aria-label={tItem.link ? `Open ${tItem.title || 'project'} link in new tab` : undefined}
      onClick={handleRowAction}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowAction();
        }
      }}
      className="group hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer"
    >
      <td className="py-4 px-6 font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
        {tItem.title || ''}
      </td>
      <td className="py-4 px-6 text-xs text-slate-500">
        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
          {tItem.category || 'Archive'}
        </span>
      </td>
      <td className="py-4 px-6 text-xs text-slate-500 font-mono text-right">
        {formatDate(tItem.date)}
      </td>
      <td className="py-4 px-6 w-12 text-center text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
        <ArrowUpRight size={16} />
      </td>
    </tr>
  );
};

export const FeaturedWorksTable = ({ tableData }) => {
  const [filterText, setFilterText] = useState('');
  if (!tableData || tableData.length === 0) return null;

  // Filter items by search query
  const filteredData = tableData.filter(item => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  return (
    <section id="archives" className="py-20 bg-slate-50/50 border-b border-slate-200/80">
      <div className="container">
        {/* Header with Title and Search */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-eyebrow">Index</span>
            <h2 className="section-title">Directory Archive</h2>
            <p className="section-desc">
              Chronological log of design experiments, print guides, and campus campaigns.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search archive..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full text-xs bg-white border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Clean Light Table */}
        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200/90 shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                  Project Title
                </th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                  Classification
                </th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans text-right">
                  Timeline
                </th>
                <th className="py-4 px-6 w-12" />
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-xs text-slate-400">
                    No directory items matching "{filterText}".
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorksTable;
