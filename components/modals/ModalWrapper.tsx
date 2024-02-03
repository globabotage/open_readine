"use client";

import { useCallback } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import axios from "axios";

const Inner: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const verifyRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log(executeRecaptcha);
      return;
    }

    const token = await executeRecaptcha("login");
    const response = await axios.post("/api/auth/recaptcha", {
      recaptchaToken: token,
    });
    return response.data;
  }, [executeRecaptcha]);

  return (
    <>
      {/* You can put the modals which use recaptcha here */}
      <RegisterModal verifyRecaptcha={verifyRecaptcha} />
      <LoginModal verifyRecaptcha={verifyRecaptcha} />
    </>
  );
};

const ReCaptchaModals = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeXCcYoAAAAAJ8y3fb5b-FDD0di_V52YtihTTxZ">
      <Inner />
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptchaModals;
