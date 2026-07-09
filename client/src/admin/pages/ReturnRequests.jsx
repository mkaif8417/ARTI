import { useEffect, useState } from 'react';
import { fetchOrders, resolveOrderRequest, markItemReceived, issueRefund } from '../../api/adminApi';

const STEP_LABELS = {
  return_requested: 'Requested',
  return_approved: 'Approved — awaiting item',
  return_received: 'Item Received',
  refunded: 'Refunded',
};

const STATUS_COLOR = {
  return_requested: 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]',
  return_approved: 'bg-blue-500/15 text-blue-400',
  return_received: 'bg-violet-500/15 text-violet-400',
  refunded: 'bg-emerald-500/15 text-emerald-400',
  delivered: 'bg-[var(--color-cream)]/10 text-[var(--color-cream)]/50', // rejected -> back to delivered
};

const STEPS = ['return_requested', 'return_approved', 'return_received', 'refunded'];

const ReturnRequests = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchOrders().then((data) => {
      const all = Array.isArray(data) ? data : [];
      setOrders(all.filter((o) => o.request?.type === 'return'));
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const withBusy = async (id, fn) => {
    setBusyId(id);
    try {
      await fn();
      load();
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = (id) => {
    const adminNote = window.prompt('Note for approving this return (optional):') || '';
    withBusy(id, () => resolveOrderRequest(id, 'approved', adminNote));
  };

  const handleReject = (id) => {
    const adminNote = window.prompt('Reason for rejecting this return (optional):') || '';
    withBusy(id, () => resolveOrderRequest(id, 'rejected', adminNote));
  };

  const handleReceived = (id) => {
    if (!window.confirm('Confirm the returned item has been received?')) return;
    withBusy(id, () => markItemReceived(id));
  };

  const handleRefund = (id) => {
    if (!window.confirm('Confirm refund has been issued to the customer?')) return;
    withBusy(id, () => issueRefund(id));
  };

  const renderProgress = (status) => {
    const idx = STEPS.indexOf(status);
    if (idx === -1) return null; // rejected -> back to delivered, no progress bar
    return (
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              i <= idx ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-cream)]/10'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderActions = (order) => {
    const busy = busyId === order._id;
    if (order.request.status === 'pending') {
      return (
        <div className="flex gap-2">
          <button disabled={busy} onClick={() => handleApprove(order._id)} className="text-xs px-3 py-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50">
            Approve
          </button>
          <button disabled={busy} onClick={() => handleReject(order._id)} className="text-xs px-3 py-1 rounded bg-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-50">
            Reject
          </button>
        </div>
      );
    }
    if (order.status === 'return_approved') {
      return (
        <button disabled={busy} onClick={() => handleReceived(order._id)} className="text-xs px-3 py-1 rounded bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 disabled:opacity-50">
          Mark Received
        </button>
      );
    }
    if (order.status === 'return_received') {
      return (
        <button disabled={busy} onClick={() => handleRefund(order._id)} className="text-xs px-3 py-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50">
          Issue Refund
        </button>
      );
    }
    if (order.status === 'refunded') {
      return <span className="text-xs text-emerald-400">Completed</span>;
    }
    if (order.request.status === 'rejected') {
      return <span className="text-xs text-[var(--color-cream)]/40">Rejected</span>;
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-2xl text-[var(--color-cream)] mb-6 [font-family:var(--font-display)]">
        Return Requests
      </h2>

      {loading ? (
        <p className="text-[var(--color-cream)]/50 text-sm">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-12 text-center">
          <p className="text-[var(--color-cream)]/50">No return requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-[var(--color-cream)]/50">#{order._id.slice(-8)}</p>
                  <p className="text-[var(--color-cream)] mt-1">{order.user?.name || '—'}</p>
                  <p className="text-[var(--color-cream)]/50 text-sm">₹{order.totalPrice}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[order.status] || STATUS_COLOR.delivered}`}>
                  {STEP_LABELS[order.status] || (order.request.status === 'rejected' ? 'Rejected' : order.status)}
                </span>
              </div>

              <p className="text-sm text-[var(--color-cream)]/60 mb-1">
                <span className="text-[var(--color-cream)]/40">Reason:</span> {order.request.reason}
              </p>
              {order.request.adminNote && (
                <p className="text-sm text-[var(--color-cream)]/40 mb-4">
                  Admin note: {order.request.adminNote}
                </p>
              )}

              <div className="mb-4">{renderProgress(order.status)}</div>

              <div className="flex justify-end">{renderActions(order)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReturnRequests;