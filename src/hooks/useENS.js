'use client';

import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

// Simple in-memory cache shared across hook instances
const ensCache = new Map();

/**
 * Resolve an Ethereum address to its ENS name (and optionally avatar).
 * Results are cached in memory to avoid repeated RPC calls.
 *
 * @param {string|null} address - The Ethereum address to resolve
 * @returns {{ ensName: string|null, ensAvatar: string|null, isLoading: boolean }}
 */
export const useENS = (address) => {
  const [ensName, setEnsName] = useState(null);
  const [ensAvatar, setEnsAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    if (!address || typeof window === 'undefined' || !window.ethereum) {
      setEnsName(null);
      setEnsAvatar(null);
      return;
    }

    // Check cache first
    const cached = ensCache.get(address.toLowerCase());
    if (cached) {
      setEnsName(cached.name);
      setEnsAvatar(cached.avatar);
      return;
    }

    const resolve = async () => {
      setIsLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const name = await provider.lookupAddress(address);

        if (cancelledRef.current) return;

        let avatar = null;
        if (name) {
          try {
            avatar = await provider.getAvatar(name);
          } catch {
            // Avatar resolution can fail silently
          }
        }

        if (cancelledRef.current) return;

        // Cache the result
        ensCache.set(address.toLowerCase(), { name, avatar });
        setEnsName(name);
        setEnsAvatar(avatar);
      } catch {
        // ENS resolution failed (e.g. wrong network, no ENS support)
        if (!cancelledRef.current) {
          ensCache.set(address.toLowerCase(), { name: null, avatar: null });
          setEnsName(null);
          setEnsAvatar(null);
        }
      } finally {
        if (!cancelledRef.current) {
          setIsLoading(false);
        }
      }
    };

    resolve();

    return () => {
      cancelledRef.current = true;
    };
  }, [address]);

  return { ensName, ensAvatar, isLoading };
};

export default useENS;
