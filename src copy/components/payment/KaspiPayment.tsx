
import React, { useState, useEffect } from 'react';
import { QrCode, ArrowRight, ExternalLink, Copy, CheckCircle2, RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services/paymentService';
import { Separator } from '@/components/ui/separator';

interface KaspiPaymentProps {
  amount: number;
  onSuccess: () => void;
  onFailed?: () => void;
}

const KaspiPayment: React.FC<KaspiPaymentProps> = ({ 
  amount, 
  onSuccess,
  onFailed 
}) => {
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<'initial' | 'qr' | 'verifying' | 'confirm' | 'failed'>('initial');
  const [paymentId, setPaymentId] = useState<string>(paymentService.generatePaymentId());
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Generate QR code URL (in a real app, this would be generated from the backend)
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(`kaspi://pay?service=AIPlatform&amount=${amount}&account=${paymentId}`);
  
  // Record the payment when component mounts or paymentId changes
  useEffect(() => {
    const recordInitialPayment = async () => {
      await paymentService.recordPayment({
        paymentId,
        amount,
        status: 'pending'
      });
    };
    
    recordInitialPayment();
  }, [paymentId, amount]);
  
  const handleCopyPaymentId = () => {
    navigator.clipboard.writeText(paymentId);
    setCopied(true);
    
    toast({
      description: "Payment ID copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleVerifyPayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setPaymentStep('verifying');
    
    try {
      // In a real implementation, this would verify with Kaspi's API
      const status = await paymentService.verifyPayment(paymentId);
      
      if (status === 'completed') {
        setPaymentStep('confirm');
        // Simulate a delay before calling onSuccess
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else if (status === 'pending') {
        setPaymentStep('qr');
        toast({
          title: "Payment still pending",
          description: "The payment has not been completed yet. Please complete the payment in your Kaspi app.",
          variant: "destructive",
        });
      } else {
        setPaymentStep('failed');
        toast({
          title: "Payment failed",
          description: "Your payment could not be processed. Please try again.",
          variant: "destructive",
        });
        
        if (onFailed) {
          onFailed();
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentStep('failed');
      toast({
        title: "Verification error",
        description: "Could not verify payment status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRegeneratePayment = () => {
    setPaymentId(paymentService.generatePaymentId());
    setPaymentStep('initial');
  };
  
  // Development helper for testing
  const handleSimulatePayment = () => {
    setPaymentStep('verifying');
    setIsProcessing(true);
    
    // Simulate successful payment after 2 seconds
    setTimeout(() => {
      setPaymentStep('confirm');
      setIsProcessing(false);
      
      // Notify parent component
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      {paymentStep === 'initial' && (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-sm">Kaspi Payment</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium">Kaspi Bank</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID</span>
                <div className="flex items-center">
                  <span className="font-medium text-xs mr-2 font-mono">{paymentId}</span>
                  <button 
                    onClick={handleCopyPaymentId}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => setPaymentStep('qr')}
              className="w-full"
            >
              Pay with Kaspi QR
              <QrCode className="ml-2 h-4 w-4" />
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline"
                onClick={handleSimulatePayment}
                className="w-full"
              >
                Simulate Successful Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            By proceeding with the payment, you agree to our Terms of Service and Payment Processing Policy.
          </div>
        </div>
      )}
      
      {paymentStep === 'qr' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <h3 className="font-medium mb-2">Scan with Kaspi App</h3>
            <p className="text-sm text-gray-500 mb-4">Open your Kaspi App and scan this QR code</p>
            
            <div className="border p-4 rounded-lg mb-4">
              <img 
                src={qrCodeUrl} 
                alt="Kaspi QR Payment" 
                className="w-48 h-48"
              />
            </div>
            
            <div className="text-sm text-gray-500 mb-2">Payment ID</div>
            <div className="flex items-center mb-6">
              <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono mr-2">{paymentId}</code>
              <button 
                onClick={handleCopyPaymentId}
                className="text-gray-500 hover:text-gray-900"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="w-full space-y-2">
              <Button 
                variant="outline"
                onClick={() => setPaymentStep('initial')}
                className="w-full"
              >
                Back to Payment Options
              </Button>
              
              <Button 
                onClick={handleVerifyPayment}
                className="w-full"
                disabled={isProcessing}
              >
                I've Completed the Payment
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {paymentStep === 'verifying' && (
        <div className="flex flex-col items-center py-8">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <h3 className="font-medium text-lg mb-1">Verifying Payment</h3>
          <p className="text-gray-500 text-sm mb-4">Please wait while we verify your payment...</p>
        </div>
      )}
      
      {paymentStep === 'confirm' && (
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="font-medium text-lg mb-1">Payment Successful</h3>
          <p className="text-gray-500 text-sm mb-4">Your task is being submitted</p>
        </div>
      )}
      
      {paymentStep === 'failed' && (
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="font-medium text-lg mb-1">Payment Failed</h3>
          <p className="text-gray-500 text-sm mb-4">Your payment could not be processed</p>
          
          <div className="w-full space-y-2 mt-2">
            <Button 
              variant="outline"
              onClick={handleRegeneratePayment}
              className="w-full"
            >
              Try Again
              <RefreshCcw className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaspiPayment;
