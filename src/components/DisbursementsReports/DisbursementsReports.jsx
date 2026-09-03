import { useState, useCallback, useRef } from 'react';
import { generateWithGemini, REPORT_PROMPTS } from '../../utils/geminiApi';
import './DisbursementsReports.css';

/**
 * Disbursements & Reports — AI-powered report generation using Gemini API.
 */
export default function DisbursementsReports() {
  const [activeTab, setActiveTab] = useState('disbursements');
  const [selectedReport, setSelectedReport] = useState(null);
  const [generatedReport, setGeneratedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  // ---- Disbursement data ----
  const disbursementData = [
    {
      panchayat: 'Kolyari',
      sanctioned: 10.2,
      disbursed: 9.8,
      pending: 0.4,
      structures: 14,
      utilizationPct: 96,
      status: 'cleared',
    },
    {
      panchayat: 'Bakarol',
      sanctioned: 8.5,
      disbursed: 7.8,
      pending: 0.7,
      structures: 12,
      utilizationPct: 92,
      status: 'cleared',
    },
    {
      panchayat: 'Malviya',
      sanctioned: 6.8,
      disbursed: 5.7,
      pending: 1.1,
      structures: 10,
      utilizationPct: 84,
      status: 'partial',
    },
    {
      panchayat: 'Mamer',
      sanctioned: 5.3,
      disbursed: 5.1,
      pending: 0.2,
      structures: 8,
      utilizationPct: 96,
      status: 'cleared',
    },
  ];

  const categoryData = [
    { category: 'Check Dams', amount: 12.2, count: 18, icon: '🏗️' },
    { category: 'Contour Trenches', amount: 6.8, count: 16, icon: '🌾' },
    { category: 'Farm Ponds', amount: 5.4, count: 12, icon: '💧' },
    { category: 'Nala Bunds', amount: 4.0, count: 6, icon: '🧱' },
  ];

  const totalSanctioned = 30.8;
  const totalDisbursed = 28.4;
  const totalPending = 2.4;
  const overallUtilization = 92;

  // ---- Report Templates ----
  const reportTemplates = [
    {
      id: 'blockSummary',
      title: 'Block Catchment Summary',
      description: 'Executive summary of all watershed activities, KPIs, and panchayat health in the Chandur Railway block.',
      icon: '📊',
      promptKey: 'blockSummary',
    },
    {
      id: 'verificationReport',
      title: 'Field Verification Report',
      description: 'Site-wise verification status, risk assessment, satellite vs ground-truth analysis, and action items.',
      icon: '🔍',
      promptKey: 'verificationReport',
    },
    {
      id: 'disbursementReport',
      title: 'Disbursement & Expenditure Report',
      description: 'Fund utilization breakdown by category and panchayat, compliance observations, pending approvals.',
      icon: '💰',
      promptKey: 'disbursementReport',
    },
  ];

  const handleGenerate = useCallback(async (template) => {
    setSelectedReport(template.id);
    setGeneratedReport('');
    setError(null);
    setIsGenerating(true);

    try {
      const text = await generateWithGemini(REPORT_PROMPTS[template.promptKey], template.promptKey);
      setGeneratedReport(text);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleDownloadReport = useCallback(() => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watershed_report_${selectedReport || 'custom'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedReport, selectedReport]);

  return (
    <div className="dr-container" id="disbursements-reports-page">
      {/* Page Header */}
      <header className="dr-header">
        <div>
          <span className="dr-header__meta">FINANCIAL MANAGEMENT & AI REPORTS</span>
          <h2 className="dr-header__title">Disbursements & Reports</h2>
        </div>
        <div className="dr-header__summary-chips">
          <div className="dr-chip">
            <span className="dr-chip__label">Sanctioned</span>
            <span className="dr-chip__val">₹{totalSanctioned}L</span>
          </div>
          <div className="dr-chip dr-chip--green">
            <span className="dr-chip__label">Disbursed</span>
            <span className="dr-chip__val">₹{totalDisbursed}L</span>
          </div>
          <div className="dr-chip dr-chip--amber">
            <span className="dr-chip__label">Pending</span>
            <span className="dr-chip__val">₹{totalPending}L</span>
          </div>
          <div className="dr-chip dr-chip--cyan">
            <span className="dr-chip__label">Utilization</span>
            <span className="dr-chip__val">{overallUtilization}%</span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="dr-tabs">
        <button
          className={`dr-tab ${activeTab === 'disbursements' ? 'dr-tab--active' : ''}`}
          onClick={() => setActiveTab('disbursements')}
          type="button"
        >
          💰 Disbursements
        </button>
        <button
          className={`dr-tab ${activeTab === 'reports' ? 'dr-tab--active' : ''}`}
          onClick={() => setActiveTab('reports')}
          type="button"
        >
          🤖 AI Reports (Gemini)
        </button>
      </div>

      {/* ====== TAB: Disbursements ====== */}
      {activeTab === 'disbursements' && (
        <div className="dr-tab-content">
          {/* Category Breakdown Cards */}
          <section className="dr-section">
            <h3 className="dr-section__title">Category-wise Expenditure</h3>
            <div className="dr-category-grid">
              {categoryData.map((c) => (
                <div className="dr-cat-card" key={c.category}>
                  <span className="dr-cat-card__icon">{c.icon}</span>
                  <div className="dr-cat-card__info">
                    <span className="dr-cat-card__name">{c.category}</span>
                    <span className="dr-cat-card__amount">₹{c.amount} Lakhs</span>
                    <span className="dr-cat-card__count">{c.count} structures</span>
                  </div>
                  <div className="dr-cat-card__bar-wrap">
                    <div
                      className="dr-cat-card__bar"
                      style={{ width: `${(c.amount / totalSanctioned) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Panchayat Table */}
          <section className="dr-section">
            <h3 className="dr-section__title">Gram Panchayat Disbursement Status</h3>
            <div className="dr-table-wrap">
              <table className="dr-table">
                <thead>
                  <tr>
                    <th>Gram Panchayat</th>
                    <th>Sanctioned (₹L)</th>
                    <th>Disbursed (₹L)</th>
                    <th>Pending (₹L)</th>
                    <th>Structures</th>
                    <th>Utilization</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {disbursementData.map((d) => (
                    <tr key={d.panchayat}>
                      <td className="dr-td-name">{d.panchayat}</td>
                      <td>₹{d.sanctioned}</td>
                      <td className="dr-td-green">₹{d.disbursed}</td>
                      <td className={d.pending > 1 ? 'dr-td-amber' : ''}>₹{d.pending}</td>
                      <td>{d.structures}</td>
                      <td>
                        <div className="dr-util-bar-wrap">
                          <div
                            className="dr-util-bar"
                            style={{
                              width: `${d.utilizationPct}%`,
                              background:
                                d.utilizationPct >= 90
                                  ? 'linear-gradient(90deg, #34d399, #2dd4a0)'
                                  : d.utilizationPct >= 80
                                  ? 'linear-gradient(90deg, #ffc857, #f5b83d)'
                                  : 'linear-gradient(90deg, #ff5c5c, #ff7a7a)',
                            }}
                          />
                          <span className="dr-util-label">{d.utilizationPct}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`dr-status-pill dr-status-pill--${d.status}`}>
                          {d.status === 'cleared' ? '✓ Cleared' : '⏳ Partial'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="dr-td-name">TOTAL</td>
                    <td>₹{totalSanctioned}</td>
                    <td className="dr-td-green">₹{totalDisbursed}</td>
                    <td className="dr-td-amber">₹{totalPending}</td>
                    <td>44</td>
                    <td>
                      <div className="dr-util-bar-wrap">
                        <div className="dr-util-bar" style={{ width: `${overallUtilization}%`, background: 'linear-gradient(90deg, #34d399, #2dd4a0)' }} />
                        <span className="dr-util-label">{overallUtilization}%</span>
                      </div>
                    </td>
                    <td>—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ====== TAB: AI Reports ====== */}
      {activeTab === 'reports' && (
        <div className="dr-tab-content">
          <section className="dr-section">
            <h3 className="dr-section__title">Generate Report with Gemini AI</h3>
            <p className="dr-section__desc">
              Select a report template below. Gemini AI will analyze watershed data and produce a professional,
              government-grade report ready for download or print.
            </p>

            <div className="dr-report-grid">
              {reportTemplates.map((tmpl) => (
                <div
                  className={`dr-report-card ${selectedReport === tmpl.id ? 'dr-report-card--selected' : ''}`}
                  key={tmpl.id}
                >
                  <span className="dr-report-card__icon">{tmpl.icon}</span>
                  <h4 className="dr-report-card__title">{tmpl.title}</h4>
                  <p className="dr-report-card__desc">{tmpl.description}</p>
                  <button
                    className="dr-report-card__btn"
                    onClick={() => handleGenerate(tmpl)}
                    disabled={isGenerating}
                    type="button"
                  >
                    {isGenerating && selectedReport === tmpl.id ? (
                      <>
                        <span className="dr-spinner" /> Generating…
                      </>
                    ) : (
                      '🤖 Generate Report'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Generated Report Output */}
          {(generatedReport || isGenerating || error) && (
            <section className="dr-section" ref={reportRef}>
              <div className="dr-report-output">
                <div className="dr-report-output__header">
                  <h3>
                    {reportTemplates.find((r) => r.id === selectedReport)?.icon}{' '}
                    {reportTemplates.find((r) => r.id === selectedReport)?.title}
                  </h3>
                  {generatedReport && (
                    <button className="dr-report-download" onClick={handleDownloadReport} type="button">
                      📥 Download .txt
                    </button>
                  )}
                </div>

                {isGenerating && (
                  <div className="dr-generating">
                    <div className="dr-generating__anim">
                      <span></span><span></span><span></span>
                    </div>
                    <p>Gemini AI is analyzing watershed data and generating your report…</p>
                  </div>
                )}

                {error && (
                  <div className="dr-error">
                    <strong>⚠️ Generation Failed</strong>
                    <p>{error}</p>
                  </div>
                )}

                {generatedReport && (
                  <div className="dr-report-body">
                    {generatedReport.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) return <h2 key={i}>{line.replace('# ', '')}</h2>;
                      if (line.startsWith('## ')) return <h3 key={i}>{line.replace('## ', '')}</h3>;
                      if (line.startsWith('### ')) return <h4 key={i}>{line.replace('### ', '')}</h4>;
                      if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>;
                      if (line.startsWith('**') && line.endsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
