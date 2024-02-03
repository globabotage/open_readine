const ReCaptchaBar = () => {
  return (
    <div className="w-full flex justify-center text-center">
      <div className="w-3/4 text-xs text-yt-text-gray">
        This site is protected by reCAPTCHA and the Google
        <a className="underline" href="https://policies.google.com/privacy">
          Privacy Policy
        </a>{" "}
        and
        <a className="underline" href="https://policies.google.com/terms">
          Terms of Service
        </a>{" "}
        apply.
      </div>
    </div>
  );
};

export default ReCaptchaBar;
