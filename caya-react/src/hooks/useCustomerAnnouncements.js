import { useEffect, useState } from "react";
import { loadCustomerAnnouncements } from "@/lib/customer-home.js";

export function useCustomerAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadCustomerAnnouncements()
      .then((items) => {
        setAnnouncements(items);
        setLoading(false);
      })
      .catch(() => {
        setAnnouncements([]);
        setLoading(false);
      });
  }, []);

  return {
    announcements,
    loading
  };
}
