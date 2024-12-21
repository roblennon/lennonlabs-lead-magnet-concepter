import { useState, useEffect } from "react";

export const useInitialEmail = () => {
  const [initialEmail, setInitialEmail] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setInitialEmail(emailParam);
    }
  }, []);

  return initialEmail;
};