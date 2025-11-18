"use client";

import { useEffect, useState } from "react";

export function useBuildings(category) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/buildings?category=${category}`);
        const json = await res.json();

        const arr = Array.isArray(json) ? json : json?.data || [];

        setData(arr);
      } catch (e) {
        console.error("Failed to load buildings:", e);
        setData([]);
      }
      setLoading(false);
    }

    load();
  }, [category]);

  return { data, loading };
}
