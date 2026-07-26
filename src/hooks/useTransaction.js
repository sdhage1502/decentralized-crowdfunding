'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Transaction status state machine:
 *   idle → pending → confirming → confirmed
 *                  → failed
 *
 * Usage:
 *   const { execute, status, txHash, receipt, error } = useTransaction();
 *
 *   const handleContribute = async () => {
 *     await execute(async () => {
 *       const contract = await getSignedContract();
 *       const tx = await contract.contribute(id, { value: amountWei });
 *       return tx; // Return the raw tx object — the hook calls tx.wait()
 *     });
 *   };
 */
export const useTransaction = () => {
  const [status, setStatus] = useState('idle'); // idle | pending | confirming | confirmed | failed
  const [txHash, setTxHash] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setReceipt(null);
    setError(null);
  }, []);

  /**
   * Execute a blockchain transaction with full lifecycle tracking.
   * @param {Function} txFn - Async function that returns a transaction object (the result of contract.method())
   * @param {object} [options]
   * @param {string} [options.pendingMessage] - Custom pending toast message
   * @param {string} [options.successMessage] - Custom success toast message
   * @param {Function} [options.onSuccess] - Callback fired after confirmation with receipt
   */
  const execute = useCallback(async (txFn, options = {}) => {
    const {
      pendingMessage = 'Sending transaction...',
      successMessage = 'Transaction confirmed!',
      onSuccess,
    } = options;

    reset();
    setStatus('pending');

    // Show persistent pending toast
    const toastId = toast.loading(pendingMessage, {
      icon: '⏳',
    });

    try {
      // Execute the user-provided function to get the raw tx
      const tx = await txFn();

      if (!tx || !tx.hash) {
        throw new Error('Transaction was not created.');
      }

      setTxHash(tx.hash);
      setStatus('confirming');

      // Update toast to show confirming state
      toast.loading('Waiting for confirmation...', {
        id: toastId,
        icon: '⛓️',
      });

      // Wait for on-chain confirmation
      const txReceipt = await tx.wait();
      setReceipt(txReceipt);
      setStatus('confirmed');

      // Success toast
      toast.success(successMessage, {
        id: toastId,
        duration: 5000,
        icon: '✅',
      });

      if (onSuccess) {
        onSuccess(txReceipt);
      }

      return txReceipt;
    } catch (err) {
      setError(err);
      setStatus('failed');

      // Determine user-friendly error message
      let errorMessage = 'Transaction failed.';
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        errorMessage = 'Transaction rejected by user.';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for this transaction.';
      } else if (err.message?.includes('not registered')) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        id: toastId,
        duration: 6000,
      });

      throw err;
    }
  }, [reset]);

  return {
    execute,
    status,
    txHash,
    receipt,
    error,
    reset,
    isPending: status === 'pending' || status === 'confirming',
  };
};

export default useTransaction;
