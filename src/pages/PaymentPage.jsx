import { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/ui';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'error'

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus('success');
    }, 2000);
  };

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
                <h4 className="font-bold text-lg leading-tight mb-1">Court A - Premium</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[rgba(0,255,136,0.1)] text-[var(--accent-green)]">Basketball</span>
                  <span className="text-xs text-[var(--text-muted)]">Indoor</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div> Date
                </span>
                <span className="font-medium text-[var(--text-primary)]">Feb 15, 2026</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div> Time
                </span>
                <span className="font-medium text-[var(--text-primary)]">6:00 PM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div> Duration
                </span>
                <span className="font-medium text-[var(--text-primary)]">2 hours</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <span>₱1,200.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Service Fee</span>
                <span>₱50.00</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 text-[var(--accent-green)]">
                <span>Total</span>
                <span>₱1,250.00</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          <Card variant="elevated" className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
            
            {/* Visual Payment Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group ${
                  paymentMethod === 'card'
                    ? 'border-[var(--accent-green)] bg-[rgba(0,255,136,0.05)] shadow-[var(--glow-green)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--text-secondary)]'
                }`}
              >
                {paymentMethod === 'card' && (
                  <div className="absolute top-2 right-2 text-[var(--accent-green)]">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                <CreditCard className={`w-8 h-8 mb-3 ${paymentMethod === 'card' ? 'text-[var(--accent-green)]' : 'text-[var(--text-secondary)]'}`} />
                <span className={`text-sm font-bold ${paymentMethod === 'card' ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'}`}>Card</span>
                <div className="flex gap-2 mt-2 opacity-50 grayscale group-hover:grayscale-0 transition-all">
                  <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
                  <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
                </div>
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
              
              <button
                onClick={() => setPaymentMethod('paymaya')}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 group ${
                  paymentMethod === 'paymaya'
                    ? 'border-[#000000] bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--text-secondary)]'
                }`}
              >
                 {paymentMethod === 'paymaya' && (
                  <div className="absolute top-2 right-2 text-white">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                <Wallet className={`w-8 h-8 mb-3 ${paymentMethod === 'paymaya' ? 'text-white' : 'text-[var(--text-secondary)]'}`} />
                <span className={`text-sm font-bold ${paymentMethod === 'paymaya' ? 'text-white' : 'text-[var(--text-primary)]'}`}>PayMaya</span>
              </button>
            </div>

            {/* Dynamic Form Content */}
            <form onSubmit={handlePayment} className="animate-fade-in">
              {paymentMethod === 'card' && (
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

              {paymentMethod !== 'card' && (
                <div className="text-center py-10 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-subtle)] border-dashed">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${paymentMethod === 'gcash' ? 'bg-[#007DFE]/10' : 'bg-white/5'}`}>
                    {paymentMethod === 'gcash' ? <Smartphone className="w-10 h-10 text-[#007DFE]" /> : <Wallet className="w-10 h-10 text-white" />}
                  </div>
                  <h3 className="text-lg font-bold mb-2">Pay with {paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
                    You will be securely redirected to the {paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'} payment portal to complete your transaction.
                  </p>
                  <Button variant="outline" type="button" className="hover:bg-[var(--bg-secondary)]">
                    Link {paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'} Account
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
                  'Pay ₱1,250.00'
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
