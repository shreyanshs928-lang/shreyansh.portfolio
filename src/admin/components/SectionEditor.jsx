import React, { useState } from 'react';
import { Save } from 'lucide-react';

export const SectionEditor = ({ title, sectionKey, initialData, onSave }) => {
  const [data, setData] = useState(initialData || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(sectionKey, data);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="section-editor-card glass-card p-6 mb-6"
      style={{
        backgroundColor: '#12172A',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        marginBottom: '24px'
      }}
    >
      <h3 className="display-font text-xl font-bold mb-4 text-white">{title}</h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {Object.keys(data).map((key) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              {key}
            </label>
            {typeof data[key] === 'string' && data[key].length > 60 ? (
              <textarea
                value={data[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="bg-[#0B0F19] text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none text-sm"
                rows={3}
              />
            ) : (
              <input
                type="text"
                value={typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="bg-[#0B0F19] text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none text-sm"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-all"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Section'}
        </button>
      </form>
    </div>
  );
};

export default SectionEditor;
