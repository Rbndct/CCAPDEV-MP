import { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Wallet, Lock, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { useAuth, API_BASE_URL } from '../contexts/AuthContext';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isLoggedIn } = useAuth();
  
  // Used only for the reservation-specific checkout view.
  const [paymentMethod, setPaymentMethod] = useState('gcash'); // 'cash'|'credit'|'debit'|'gcash'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'error'
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Payments due tab state (when no reservationId is selected)
  const [dueItems, setDueItems] = useState([]);
  const [dueTotal, setDueTotal] = useState(0);
  const [isDueLoading, setIsDueLoading] = useState(false);
  const [dueMessage, setDueMessage] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState({});
  const [payingReservationId, setPayingReservationId] = useState(null);

  // Amount simulation modal
  const [simItem, setSimItem] = useState(null); // { reservationId, method, totalDue }
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

    if (!reservationId) {
        setIsLoading(false);
        const fetchDue = async () => {
          setIsDueLoading(true);
          setDueMessage('');
          try {
            const res = await fetch(`${API_BASE_URL}/payments/due`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.message || 'Failed to fetch payment due.');
            }
            const data = await res.json();
            setDueItems(Array.isArray(data.items) ? data.items : []);
            setDueTotal(Number(data.totalDue || 0));
          } catch (err) {
            setDueMessage(err.message || 'Failed to load payments due.');
          } finally {
            setIsDueLoading(false);
          }
        };

        const fetchPaymentHistory = async () => {
          setIsHistoryLoading(true);
          try {
            const res = await fetch(`${API_BASE_URL}/payments/history`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setHistoryItems(Array.isArray(data.items) ? data.items : []);
            }
          } catch (err) {
            console.error('Failed to load payment history', err);
          } finally {
            setIsHistoryLoading(false);
          }
        };

        fetchDue();
        fetchPaymentHistory();
        return;
    }

    const fetchReservation = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/reservations/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const found = data.find(r => r._id === reservationId);
                if (found) {
                    setReservation(found);
                }
            }
        } catch (err) {
            console.error("Failed to fetch reservation for payment", err);
        } finally {
            setIsLoading(false);
        }
    };
    fetchReservation();
  }, [isLoggedIn, token, reservationId, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!reservation) return;

    setIsProcessing(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/payments/${reservation._id}`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ paymentMethod })
        });

        if (response.ok) {
            setPaymentStatus('success');
        } else {
            const errData = await response.json();
            alert(`Payment failed: ${errData.message}`);
        }
    } catch (err) {
        console.error("Payment error", err);
        alert("Payment simulation failed. Check connection.");
    } finally {
        setIsProcessing(false);
    }
  };

  // Open the simulation modal instead of paying immediately
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

  const handleDuePayment = async (reservationId, method) => {
    if (!reservationId) return;
    setPayingReservationId(reservationId);
    setDueMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${reservationId}`, {
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

      // Refresh both due and history
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

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-[var(--accent-green)]" />
          </div>
      );
  }

  if (reservationId && !reservation && !paymentStatus) {
      return (
          <div className="max-w-md mx-auto py-12 px-6 text-center">
              <h2 className="text-2xl font-bold mb-4">No Reservation Found</h2>
              <p className="text-[var(--text-secondary)] mb-6">We couldn't figure out what you are trying to pay for.</p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
          </div>
      );
  }

  const parseTimeToMinutes = (timeStr) => {
    const [hRaw, mRaw] = String(timeStr || '').split(':');
    const h = Number(hRaw);
    const m = Number(mRaw || 0);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  // Calculate duration and totals (reservation-specific checkout view)
  let duration = 2; // Default fallback
  let hourlyRate = 0;
  let subtotal = 0;
  const serviceFee = 50;
  let total = 0;
  if (reservation) {
    const startMinutes = parseTimeToMinutes(reservation.start_time);
    const endMinutes = parseTimeToMinutes(reservation.end_time);
    hourlyRate = Number(reservation.facility?.hourly_rate_php || 0);
    if (startMinutes !== null && endMinutes !== null && endMinutes > startMinutes) {
      duration = (endMinutes - startMinutes) / 60;
    }
    subtotal = duration * hourlyRate;
    total = subtotal + serviceFee;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto py-12 px-6 text-center animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(0,255,136,0.1)] flex items-center justify-center shadow-[var(--glow-green)]">
          <CheckCircle className="w-12 h-12 text-[var(--accent-green)]" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-[var(--text-secondary)] mb-8">
          Your booking has been confirmed. You will receive an email shortly.
        </p>
        <div className="space-y-3">
          <Button variant="primary" className="w-full" onClick={() => navigate('/dashboard/bookings')}>
            View My Bookings
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Payments due tab (no specific reservation checkout selected)
  if (!reservationId) {
    if (isDueLoading) {
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
            <h1 className="text-3xl font-bold">Payments Due</h1>
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
            <p className="text-[var(--text-secondary)] mt-2">
              Your bookings are up to date.
            </p>
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
              {amountError && (
                <p className="mt-2 text-xs text-red-400">{amountError}</p>
              )}
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
                    <p className="text-lg font-bold text-[var(--accent-green)]">₱{Number(item.totalDue || 0).toFixed(2)}</p>
                    <p className="text-xs text-green-400 mt-0.5">Paid</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors mb-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full border border-[var(--border-subtle)]">
          <Lock className="w-3 h-3" />
          Secure SSL Encrypted
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary - Sticky Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card variant="glass" className="p-6 sticky top-24 border-t-4 border-t-[var(--accent-green)] shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>Booking Summary</span>
            </h3>
            
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[var(--border-subtle)]">
              <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-3xl shadow-inner">
                🏀
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight mb-1">{reservation.facility?.facility_name || 'Court'}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[rgba(0,255,136,0.1)] text-[var(--accent-green)]">{reservation.facility?.facility_type || 'Sport'}</span>
                  <span className="text-xs text-[var(--text-muted)]">Indoor</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div> Date
                </span>
                <span className="font-medium text-[var(--text-primary)]">{new Date(reservation.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div> Time
                </span>
                <span className="font-medium text-[var(--text-primary)]">{reservation.start_time} - {reservation.end_time}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div> Duration
                </span>
                <span className="font-medium text-[var(--text-primary)]">{duration} hour{duration > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Service Fee</span>
                <span>₱{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 text-[var(--accent-green)]">
                <span>Total</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          <Card variant="elevated" className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
            
            {/* Visual Payment Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group ${
                  paymentMethod === 'cash'
                    ? 'border-[var(--accent-green)] bg-[rgba(0,255,136,0.05)] shadow-[var(--glow-green)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--text-secondary)]'
                }`}
              >
                {paymentMethod === 'cash' && (
                  <div className="absolute top-2 right-2 text-[var(--accent-green)]">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                <Wallet className={`w-8 h-8 mb-3 ${paymentMethod === 'cash' ? 'text-[var(--accent-green)]' : 'text-[var(--text-secondary)]'}`} />
                <span className={`text-sm font-bold ${paymentMethod === 'cash' ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'}`}>Cash</span>
              </button>

              <button
                onClick={() => setPaymentMethod('credit')}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group ${
                  paymentMethod === 'credit'
                    ? 'border-[var(--accent-green)] bg-[rgba(0,255,136,0.05)] shadow-[var(--glow-green)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--text-secondary)]'
                }`}
              >
                {paymentMethod === 'credit' && (
                  <div className="absolute top-2 right-2 text-[var(--accent-green)]">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                <CreditCard className={`w-8 h-8 mb-3 ${paymentMethod === 'credit' ? 'text-[var(--accent-green)]' : 'text-[var(--text-secondary)]'}`} />
                <span className={`text-sm font-bold ${paymentMethod === 'credit' ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'}`}>Credit</span>
              </button>

              <button
                onClick={() => setPaymentMethod('debit')}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group ${
                  paymentMethod === 'debit'
                    ? 'border-[var(--accent-green)] bg-[rgba(0,255,136,0.05)] shadow-[var(--glow-green)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--text-secondary)]'
                }`}
              >
                {paymentMethod === 'debit' && (
                  <div className="absolute top-2 right-2 text-[var(--accent-green)]">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                <CreditCard className={`w-8 h-8 mb-3 ${paymentMethod === 'debit' ? 'text-[var(--accent-green)]' : 'text-[var(--text-secondary)]'}`} />
                <span className={`text-sm font-bold ${paymentMethod === 'debit' ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'}`}>Debit</span>
              </button>

              <button
                onClick={() => setPaymentMethod('gcash')}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group ${
                  paymentMethod === 'gcash'
                    ? 'border-[#007DFE] bg-[#007DFE]/5 shadow-[0_0_20px_rgba(0,125,254,0.3)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--text-secondary)]'
                }`}
              >
                {paymentMethod === 'gcash' && (
                  <div className="absolute top-2 right-2 text-[#007DFE]">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                <Smartphone className={`w-8 h-8 mb-3 ${paymentMethod === 'gcash' ? 'text-[#007DFE]' : 'text-[var(--text-secondary)]'}`} />
                <span className={`text-sm font-bold ${paymentMethod === 'gcash' ? 'text-[#007DFE]' : 'text-[var(--text-primary)]'}`}>GCash</span>
              </button>
            </div>

            {/* Dynamic Form Content */}
            <form onSubmit={handlePayment} className="animate-fade-in">
              {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Card Details</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent-green)]" />
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-12 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM / YY"
                        className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">CVV / CVC</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent-green)]" />
                        <input 
                          type="text" 
                          placeholder="123"
                          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="JOHN DOE"
                      className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] uppercase"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod !== 'credit' && paymentMethod !== 'debit' && (
                <div className="text-center py-10 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-subtle)] border-dashed">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                    paymentMethod === 'gcash' ? 'bg-[#007DFE]/10' : 'bg-white/5'
                  }`}>
                    {paymentMethod === 'gcash' ? (
                      <Smartphone className="w-10 h-10 text-[#007DFE]" />
                    ) : paymentMethod === 'cash' ? (
                      <Wallet className="w-10 h-10 text-white" />
                    ) : (
                      <CreditCard className="w-10 h-10 text-[var(--text-secondary)]" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {paymentMethod === 'gcash' ? 'Pay with GCash' : paymentMethod === 'cash' ? 'Pay with Cash' : 'Pay with Card'}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
                    {paymentMethod === 'gcash'
                      ? 'You will be securely redirected to the GCash payment portal to complete your transaction.'
                      : paymentMethod === 'cash'
                        ? 'You selected Cash. This is a simulation: your booking will be confirmed as paid.'
                        : 'You will be securely redirected to your card payment portal to complete your transaction.'}
                  </p>
                  <Button variant="outline" type="button" className="hover:bg-[var(--bg-secondary)]">
                    {paymentMethod === 'gcash' ? 'Link GCash Account' : 'Confirm Payment Method'}
                  </Button>
                </div>
              )}

              <Button 
                variant="primary" 
                type="submit" 
                className="w-full mt-8 py-4 text-lg font-bold shadow-lg hover:shadow-[var(--glow-green)] transition-all"
                disabled={isProcessing}
              >
                {isProcessing ? (
                   <span className="flex items-center gap-2">
                     <div className="w-5 h-5 border-2 border-[var(--bg-primary)] border-t-transparent rounded-full animate-spin"></div>
                     Processing...
                   </span>
                ) : (
                  `Pay ₱${total.toFixed(2)}`
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[var(--text-muted)]">
                 <Lock className="w-3 h-3" />
                 <span>Payments are secure and encrypted</span>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
