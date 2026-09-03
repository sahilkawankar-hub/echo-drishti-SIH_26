import { useState, useCallback } from 'react';
import './VerificationQueue.css';

/**
 * Verification Queue — dedicated page for managing pending field verifications.
 *
 * @param {{ onNavigateToMap: (siteId?: string) => void }} props
 */
export default function VerificationQueue({ onNavigateToMap }) {
  const [filter, setFilter] = useState('all');
  const [assignedTeams, setAssignedTeams] = useState({});

  const queueItems = [
    {
      id: 'vq-001',
      siteId: 'site-001',
      name: 'Check Dam #07A',
      location: 'Kolyari Village',
      type: 'Check Dam',
      status: 'verified',
      statusLabel: 'Verified Active',
      priority: 'normal',
      lastUpdate: '35 min ago',
      details: 'Impoundment depth 2.4m confirmed by GIS satellite survey. Water retention matches predicted capacity.',
      ndviDelta: '+0.28',
      assignedTo: 'Field Team Alpha',
      dueDate: 'Completed',
    },
    {
      id: 'vq-002',
      siteId: 'site-004',
      name: 'Masonry Anicut #03',
      location: 'Bakarol South',
      type: 'Anicut',
      status: 'normal',
      statusLabel: 'Water Stored Normal',
      priority: 'normal',
      lastUpdate: '2 hrs ago',
      details: 'Flow capacity stable. Minor percolation recorded downstream. No structural damage detected.',
      ndviDelta: '+0.19',
      assignedTo: 'Field Team Beta',
      dueDate: 'Completed',
    },
    {
      id: 'vq-003',
      siteId: 'site-002',
      name: 'Contour Trench – Sector A',
      location: 'Railway Ridge',
      type: 'Contour Trench',
      status: 'pending',
      statusLabel: 'Pending Review',
      priority: 'medium',
      lastUpdate: '1 day ago',
      details: 'Satellite shows vegetation improvement but ground photo timestamp mismatch. Needs re-verification.',
      ndviDelta: '+0.14',
      assignedTo: 'Unassigned',
      dueDate: 'Sep 5, 2026',
    },
    {
      id: 'vq-004',
      siteId: 'site-003',
      name: 'Community Farm Pond #12',
      location: 'Mamer Hamlet',
      type: 'Farm Pond',
      status: 'scheduled',
      statusLabel: 'Visit Scheduled',
      priority: 'medium',
      lastUpdate: 'Tomorrow 10 AM',
      details: 'Physical geotag confirmation assigned to field surveyor. Pond capacity estimation pending.',
      ndviDelta: '+0.22',
      assignedTo: 'Surveyor R. Patil',
      dueDate: 'Sep 4, 2026',
    },
    {
      id: 'vq-005',
      name: 'Gully Plug Block #09',
      location: 'Malviya Nala',
      type: 'Gully Plug',
      status: 'alert',
      statusLabel: 'Desilt Required',
      priority: 'high',
      lastUpdate: '3 hrs ago',
      details: 'Silt build-up >35%. Release valve restricted. Immediate desilting operation required before next rainfall.',
      ndviDelta: '-0.05',
      assignedTo: 'Unassigned',
      dueDate: 'URGENT',
    },
    {
      id: 'vq-006',
      name: 'Cement Nala Bund #14',
      location: 'Kolyari West',
      type: 'Nala Bund',
      status: 'pending',
      statusLabel: 'Photo Mismatch',
      priority: 'high',
      lastUpdate: '5 hrs ago',
      details: 'Ground photo shows incomplete bund wall. Satellite NDVI does not reflect expected moisture retention.',
      ndviDelta: '+0.03',
      assignedTo: 'Unassigned',
      dueDate: 'Sep 5, 2026',
    },
    {
      id: 'vq-007',
      name: 'Percolation Tank #02',
      location: 'Bakarol North',
      type: 'Percolation Tank',
      status: 'scheduled',
      statusLabel: 'Re-Inspection Due',
      priority: 'medium',
      lastUpdate: '12 hrs ago',
      details: 'Previous inspection flagged minor seepage on eastern wall. Follow-up inspection scheduled.',
      ndviDelta: '+0.31',
      assignedTo: 'Eng. M. Deshmukh',
      dueDate: 'Sep 6, 2026',
    },
  ];

  const filteredItems =
    filter === 'all'
      ? queueItems
      : queueItems.filter((item) => item.status === filter);

  const counts = {
    all: queueItems.length,
    verified: queueItems.filter((i) => i.status === 'verified').length,
    normal: queueItems.filter((i) => i.status === 'normal').length,
    pending: queueItems.filter((i) => i.status === 'pending').length,
    scheduled: queueItems.filter((i) => i.status === 'scheduled').length,
    alert: queueItems.filter((i) => i.status === 'alert').length,
  };

  const handleAssignTeam = useCallback((id) => {
    setAssignedTeams((prev) => ({ ...prev, [id]: true }));
  }, []);

  const statusColors = {
    verified: 'green',
    normal: 'cyan',
    pending: 'amber',
    scheduled: 'blue',
    alert: 'red',
  };

  const priorityLabels = {
    high: { label: '🔴 HIGH', cls: 'vq-priority--high' },
    medium: { label: '🟡 MEDIUM', cls: 'vq-priority--medium' },
    normal: { label: '🟢 NORMAL', cls: 'vq-priority--normal' },
  };

  return (
    <div className="vq-container" id="verification-queue-page">
      {/* Page Header */}
      <header className="vq-header">
        <div>
          <span className="vq-header__meta">FIELD VERIFICATION MANAGEMENT</span>
          <h2 className="vq-header__title">Verification Queue</h2>
        </div>
        <div className="vq-header__stats">
          <div className="vq-stat-chip vq-stat-chip--alert">
            <span className="vq-stat-chip__val">{counts.alert}</span>
            <span>Alerts</span>
          </div>
          <div className="vq-stat-chip vq-stat-chip--pending">
            <span className="vq-stat-chip__val">{counts.pending}</span>
            <span>Pending</span>
          </div>
          <div className="vq-stat-chip vq-stat-chip--scheduled">
            <span className="vq-stat-chip__val">{counts.scheduled}</span>
            <span>Scheduled</span>
          </div>
          <div className="vq-stat-chip vq-stat-chip--verified">
            <span className="vq-stat-chip__val">{counts.verified + counts.normal}</span>
            <span>Cleared</span>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="vq-filters">
        {[
          { id: 'all', label: 'All' },
          { id: 'alert', label: 'Alerts' },
          { id: 'pending', label: 'Pending' },
          { id: 'scheduled', label: 'Scheduled' },
          { id: 'verified', label: 'Verified' },
        ].map((f) => (
          <button
            key={f.id}
            className={`vq-filter-btn ${filter === f.id ? 'vq-filter-btn--active' : ''}`}
            onClick={() => setFilter(f.id)}
            type="button"
          >
            {f.label}
            <span className="vq-filter-btn__count">{counts[f.id] || 0}</span>
          </button>
        ))}
      </div>

      {/* Queue Table */}
      <div className="vq-table-wrap">
        <table className="vq-table">
          <thead>
            <tr>
              <th>Structure</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>NDVI Δ</th>
              <th>Assigned To</th>
              <th>Due</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className={`vq-row vq-row--${item.status}`}>
                <td>
                  <div className="vq-cell-site">
                    <span className="vq-cell-site__name">{item.name}</span>
                    <span className="vq-cell-site__loc">📍 {item.location}</span>
                  </div>
                </td>
                <td>
                  <span className="vq-type-tag">{item.type}</span>
                </td>
                <td>
                  <span className={`vq-status-badge vq-status-badge--${statusColors[item.status]}`}>
                    {item.statusLabel}
                  </span>
                </td>
                <td>
                  <span className={priorityLabels[item.priority].cls}>
                    {priorityLabels[item.priority].label}
                  </span>
                </td>
                <td>
                  <span className={`vq-ndvi ${parseFloat(item.ndviDelta) > 0.1 ? 'vq-ndvi--pos' : parseFloat(item.ndviDelta) < 0 ? 'vq-ndvi--neg' : 'vq-ndvi--neutral'}`}>
                    {item.ndviDelta}
                  </span>
                </td>
                <td>
                  <span className={`vq-assigned ${item.assignedTo === 'Unassigned' ? 'vq-assigned--none' : ''}`}>
                    {item.assignedTo}
                  </span>
                </td>
                <td>
                  <span className={`vq-due ${item.dueDate === 'URGENT' ? 'vq-due--urgent' : ''}`}>
                    {item.dueDate}
                  </span>
                </td>
                <td>
                  <div className="vq-actions">
                    {item.siteId && (
                      <button
                        className="vq-btn-view"
                        onClick={() => onNavigateToMap(item.siteId)}
                        title="View on Map"
                        type="button"
                      >
                        🗺️
                      </button>
                    )}
                    {item.status === 'alert' && !assignedTeams[item.id] && (
                      <button
                        className="vq-btn-assign"
                        onClick={() => handleAssignTeam(item.id)}
                        type="button"
                      >
                        Assign Team
                      </button>
                    )}
                    {assignedTeams[item.id] && (
                      <span className="vq-assigned-tag">✓ Dispatched</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="vq-footer">
        <span>Showing {filteredItems.length} of {queueItems.length} items</span>
        <span className="vq-footer__sync">Last sync: Today 08:30 AM • Sentinel-2 L2A</span>
      </div>
    </div>
  );
}
