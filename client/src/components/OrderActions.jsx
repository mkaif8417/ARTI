// src/components/OrderActions.jsx
import { useState } from 'react';
import { cancelOrder, requestReturnOrExchange } from '../api/api';

const CANCELLABLE = ['pending', 'processing'];

const OrderActions = ({ order, onUpdated }) => {
  const [busy, setBusy] = useState(false);

  const doCancel = async () => {
    const reason = window.prompt('Reason for cancelling?');
    if (!reason) return;
    setBusy(true);
    await cancelOrder(order._id, reason);
    setBusy(false);
    onUpdated?.();
  };

  const doRequest = async (type) => {
    const reason = window.prompt(`Reason for ${type}?`);
    if (!reason) return;
    setBusy(true);
    await requestReturnOrExchange(order._id, type, reason);
    setBusy(false);
    onUpdated?.();
  };

  if (CANCELLABLE.includes(order.status)) {
    return (
      <button disabled={busy} onClick={doCancel} className="text-sm text-red-400 hover:underline">
        Cancel Order
      </button>
    );
  }

  if (order.status === 'delivered' && !order.request) {
    return (
      <div className="flex gap-4">
        <button disabled={busy} onClick={() => doRequest('return')} className="text-sm text-orange-400 hover:underline">
          Return
        </button>
        <button disabled={busy} onClick={() => doRequest('exchange')} className="text-sm text-cyan-400 hover:underline">
          Exchange
        </button>
      </div>
    );
  }

  if (order.request) {
    return (
      <span className="text-sm text-[var(--color-cream)]/50">
        {order.request.type} request: {order.request.status}
      </span>
    );
  }

  return null;
};

export default OrderActions;