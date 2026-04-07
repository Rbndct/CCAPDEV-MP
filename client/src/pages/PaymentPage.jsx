import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Wallet, Lock, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isLoggedIn } = useAuth();
  
  // Payments due tab state
  const [dueItems, setDueItems] = useState([]);
  const [dueTotal, setDueTotal] = useState(0);
  const [isDueLoading, setIsDueLoading] = useState(true);
  const [dueMessage, setDueMessage] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState({});
  const [payingReservationId, setPayingReservationId] = useState(null);

  // Amount simulation modal
  const [simItem, setSimItem] = useState(null); // { reservationId, method, totalDue, facilityName }
  const [amountInput, setAmountInput] = useState('');
  const [amountError, setAmountError] = useState('');

  // Payment history
  const [historyItems, setHistoryItems] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const reservationId = queryParams.get('reservationId');

  useEffect(() => {
    if (!isLoggedIn || !token) {
        navigate('/');
        return;
    }

    const fetchAllData = async () => {
        setIsDueLoading(true);
        setIsHistoryLoading(true);
        try {
            const [dueRes, histRes] = await Promise.all([
                fetch(`${API_BASE_URL}/payments/due`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/payments/history`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            let fetchedDueItems = [];
            if (dueRes.ok) {
                const dueData = await dueRes.json();
                fetchedDueItems = Array.isArray(dueData.items) ? dueData.items : [];
                setDueItems(fetchedDueItems);
                setDueTotal(Number(dueData.totalDue || 0));
            }
            if (histRes.ok) {
                const histData = await histRes.json();
                setHistoryItems(Array.isArray(histData.items) ? histData.items : []);
            }

            // Auto-open simulation modal if reservationId is in URL
            if (reservationId && fetchedDueItems.length > 0) {
                const item = fetchedDueItems.find(i => i.reservationId === reservationId);
                if (item) {
                    setSimItem({ 
                        reservationId: item.reservationId, 
                        method: 'gcash', 
                        totalDue: Number(item.totalDue || 0), 
                        facilityName: item.facilityName 
                    });
                }
            }
        } catch (err) {
            console.error("Failed to fetch payment data", err);
            setDueMessage("Failed to load payment information.");
        } finally {
            setIsDueLoading(false);
            setIsHistoryLoading(false);
        }
    };

    fetchAllData();
  }, [isLoggedIn, token, reservationId, navigate]);

  const openSimModal = (item, method) => {
    setSimItem({ reservationId: item.reservationId, method, totalDue: Number(item.totalDue || 0), facilityName: item.facilityName });
    setAmountInput('');
    setAmountError('');
  };

  const handleSimConfirm = async () => {
    const entered = parseFloat(amountInput);
    if (isNaN(entered) || entered < simItem.totalDue) {
      setAmountError(`Insufficient amount. Please enter at least ₱${simItem.totalDue.toFixed(2)}.`);
      return;
    }
    setAmountError('');
    await handleDuePayment(simItem.reservationId, simItem.method);
    setSimItem(null);
  };

  const handleDuePayment = async (resId, method) => {
    if (!resId) return;
    setPayingReservationId(resId);
    setDueMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${resId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentMethod: method })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Payment simulation failed.');
      }

      // Refresh data
      const [dueRes, histRes] = await Promise.all([
        fetch(`${API_BASE_URL}/payments/due`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/payments/history`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (dueRes.ok) {
        const dueData = await dueRes.json();
        setDueItems(Array.isArray(dueData.items) ? dueData.items : []);
        setDueTotal(Number(dueData.totalDue || 0));
      }
      if (histRes.ok) {
        const histData = await histRes.json();
        setHistoryItems(Array.isArray(histData.items) ? histData.items : []);
      }

      setDueMessage('✓ Payment confirmed! Your booking is now active.');
    } catch (err) {
      setDueMessage(err.message || 'Payment simulation failed.');
    } finally {
      setPayingReservationId(null);
    }
  };

  if (isDueLoading && dueItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[var(--accent-green)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Simulate payment methods and confirm your pending bookings.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs text-[var(--text-muted)]">Total due</div>
          <div className="text-2xl font-bold text-[var(--accent-green)]">₱{dueTotal.toFixed(2)}</div>
        </div>
      </div>

      {dueMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
          dueMessage.startsWith('✓')
            ? 'bg-green-500/10 border border-green-500 text-green-400'
            : 'bg-red-500/10 border border-red-500 text-red-500'
        }`}>
          {dueMessage}
        </div>
      )}

      {dueItems.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-muted)] mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <p className="text-lg font-medium text-[var(--text-primary)]">No pending payments</p>
          <p className="text-[var(--text-secondary)] mt-2">Your bookings are up to date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dueItems.map((item) => {
            const method = selectedPaymentMethods[item.reservationId] || 'gcash';
            return (
              <Card key={item.reservationId} variant="glass" className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate">{item.facilityName}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {item.start_time} - {item.end_time}
                    </p>
                    <div className="mt-3 text-sm text-[var(--text-muted)] space-y-1">
                      <div>Subtotal: ₱{Number(item.subtotal || 0).toFixed(2)}</div>
                      <div>Service fee: ₱{Number(item.serviceFee || 0).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--accent-green)]">₱{Number(item.totalDue || 0).toFixed(2)}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">Due now</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-[var(--text-secondary)]">Payment method</div>
                    <select
                      value={method}
                      onChange={(e) => setSelectedPaymentMethods(prev => ({ ...prev, [item.reservationId]: e.target.value }))}
                      className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-green)]"
                    >
                      <option value="cash">Cash</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                      <option value="gcash">GCash</option>
                    </select>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => openSimModal(item, method)}
                    disabled={payingReservationId === item.reservationId}
                    className="w-full md:w-auto"
                  >
                    {payingReservationId === item.reservationId ? 'Processing...' : `Pay ₱${Number(item.totalDue || 0).toFixed(2)}`}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Amount Simulation Modal */}
      {simItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(0,0,0,0.7)'}}>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-bold mb-1">Simulate Payment</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Paying for <span className="font-semibold text-[var(--text-primary)]">{simItem.facilityName}</span>
            </p>
            <div className="flex justify-between text-sm mb-4 p-3 rounded-lg bg-[var(--bg-tertiary)]">
              <span className="text-[var(--text-secondary)]">Amount Due</span>
              <span className="font-bold text-[var(--accent-green)]">₱{simItem.totalDue.toFixed(2)}</span>
            </div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Enter Cash Amount (₱)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amountInput}
              onChange={e => { setAmountInput(e.target.value); setAmountError(''); }}
              placeholder={`e.g. ${simItem.totalDue.toFixed(2)}`}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-sm focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] focus:outline-none transition-all"
              autoFocus
            />
            {amountError && <p className="mt-2 text-xs text-red-400">{amountError}</p>}
            {amountInput && !amountError && parseFloat(amountInput) >= simItem.totalDue && (
              <p className="mt-2 text-xs text-green-400">Change: ₱{(parseFloat(amountInput) - simItem.totalDue).toFixed(2)}</p>
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setSimItem(null)}
                className="flex-1 py-2.5 rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSimConfirm}
                disabled={payingReservationId === simItem.reservationId}
                className="flex-1 py-2.5 rounded-lg bg-[var(--accent-green)] text-black font-bold text-sm hover:bg-[rgba(0,255,136,0.8)] transition-all disabled:opacity-50"
              >
                {payingReservationId === simItem.reservationId ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
        {isHistoryLoading ? (
          <div className="flex justify-center py-6"><Loader className="w-6 h-6 animate-spin text-[var(--accent-green)]" /></div>
        ) : historyItems.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)]">
            No payment history yet.
          </div>
        ) : (
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div key={item.reservationId} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <div>
                  <p className="font-semibold">{item.facilityName}</p>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {item.start_time} – {item.end_time}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 capitalize">via {item.payment_method || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${item.payment_status === 'refunded' ? 'text-red-400 line-through' : 'text-[var(--accent-green)]'}`}>
                    ₱{Number(item.totalDue || 0).toFixed(2)}
                  </p>
                  <p className={`text-xs mt-0.5 ${item.payment_status === 'refunded' ? 'text-red-400' : 'text-green-400'}`}>
                    {item.payment_status === 'refunded' ? 'Refunded' : 'Paid'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
