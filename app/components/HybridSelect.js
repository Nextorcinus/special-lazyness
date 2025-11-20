"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../components/ui/select";

// props: value, onChange, options, placeholder, className
export default function HybridSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsMobile(
        typeof window !== "undefined" &&
        (window.innerWidth <= 865 ||
          /iPhone|iPod|Android/i.test(navigator.userAgent))
      );

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // === MOBILE: Native select ===
  if (isMobile) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-special-input text-white w-full rounded-md p-2 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // === DESKTOP: SHADCN select ===
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`bg-special-input text-white w-full ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
