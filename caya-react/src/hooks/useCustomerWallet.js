import { useEffect, useState } from "react";
import { loadCustomerWallet } from "@/lib/wallet.js";

const initialState = {
  birthdayReward: null,
  giftCards: [],
  promos: [],
  referralRewards: [],
  storeCredit: 0
};

export function useCustomerWallet(user, profile) {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(initialState);

  const refresh = () => {
    if (!user?.email) {
      setWallet({
        ...initialState,
        birthdayReward: null,
        storeCredit: Number(profile?.storeCredit || 0)
      });
      setLoading(false);
      return Promise.resolve();
    }

    setLoading(true);

    return loadCustomerWallet(user.email, profile)
      .then((nextWallet) => {
        setWallet(nextWallet);
        setLoading(false);
      })
      .catch(() => {
        setWallet({
          ...initialState,
          birthdayReward: null,
          storeCredit: Number(profile?.storeCredit || 0)
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    refresh();
  }, [profile, user?.email]);

  return {
    loading,
    refresh,
    wallet
  };
}
