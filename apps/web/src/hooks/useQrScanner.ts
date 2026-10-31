import { useState, useCallback, useRef } from 'react';
import { type IDetectedBarcode } from '@yudiel/react-qr-scanner';

interface UseQrScannerOptions {
  /** Called with the decoded text and a `resume` callback that re-enables the scanner. */
  onSuccess: (code: string, resume: () => void) => void | Promise<void>;
  onError?: (error: string) => void;
  validateCode?: (code: string) => boolean;
}

export const useQrScanner = ({ onSuccess, onError, validateCode }: UseQrScannerOptions) => {
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs so that closures inside handleScan never go stale
  const isProcessingRef = useRef(false);
  const lastDecodedRef = useRef<string | null>(null);

  const resumeScanner = useCallback(() => {
    setIsProcessing(false);
    setIsPaused(false);
    isProcessingRef.current = false;
    // Small delay before accepting the same code again
    setTimeout(() => {
      lastDecodedRef.current = null;
    }, 500);
  }, []);

  const handleScan = useCallback(
    async (detectedCodes: IDetectedBarcode[]) => {
      if (detectedCodes.length === 0) return;

      const decodedText = detectedCodes[0].rawValue;
      setScannedText(decodedText);

      // Deduplicate and ignore while a result is being processed
      if (isProcessingRef.current || decodedText === lastDecodedRef.current) return;

      if (validateCode && !validateCode(decodedText)) {
        // Deduplicate invalid codes the same way as valid ones so the camera
        // loop doesn't fire onError dozens of times per second for the same code.
        lastDecodedRef.current = decodedText;
        onError?.('Código inválido');
        return;
      }

      lastDecodedRef.current = decodedText;
      isProcessingRef.current = true;
      setIsProcessing(true);
      setIsPaused(true);

      await onSuccess(decodedText, resumeScanner);
    },
    [validateCode, onSuccess, onError, resumeScanner],
  );

  const reset = useCallback(() => {
    setScannedText(null);
    setIsProcessing(false);
    setIsPaused(false);
    isProcessingRef.current = false;
    lastDecodedRef.current = null;
  }, []);

  return {
    /** Pass directly to <Scanner onScan={handleScan} /> */
    handleScan,
    scannedText,
    isProcessing,
    /** Pass directly to <Scanner paused={isPaused} /> */
    isPaused,
    resumeScanner,
    reset,
  };
};
