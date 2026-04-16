import React from 'react';
import { useEffect } from 'react';

export function useRealtimeSync({ isAuthenticated, onDataUpdate, interval = 10000, enabled = true }) {
  useEffect(() => {
    if (!isAuthenticated || !enabled) return;

    const fetchData = async () => {
      try {
        const [ordersRes, intentsRes, reviewsRes] = await Promise.all([
          fetch('/api/orders').then(r => r.json()),
          fetch('/api/intents?limit=50').then(r => r.json()),
          fetch('/api/reviews').then(r => r.json())
        ]);

        onDataUpdate({
          orders: Array.isArray(ordersRes) ? ordersRes : [],
          intents: Array.isArray(intentsRes) ? intentsRes : [],
          reviews: Array.isArray(reviewsRes) ? reviewsRes : []
        });
      } catch (error) {
        console.error('RealtimeSync fetch error:', error);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, interval);
    return () => clearInterval(timer);
  }, [isAuthenticated, enabled, interval, onDataUpdate]);
}

export default function RealtimeSync() {
  return null;
}
