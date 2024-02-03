"use client";

import { signIn } from "next-auth/react";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "./Modal";
import Heading from "../Heading";

import toast from "react-hot-toast";
import Button from "../Button";
import { useRouter } from "next/navigation";
import useRegisterModal from "@/hooks/modal/useRegisterModal";
import useLoginModal from "@/hooks/modal/useLoginModal";
import Input from "../Input";
import ReCaptchaBar from "./ReCaptchaBar";
import LogoMessage from "../LogoMessage";

interface LoginModalProps {
  verifyRecaptcha: () => Promise<any>;
}

const LoginModal: React.FC<LoginModalProps> = ({ verifyRecaptcha }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const [mode, setMode] = useState<"default" | "reset" | "mailVerify">(
    "default"
  );

  const [resetReason, setResetReason] = useState<"security" | "forgetting">(
    "security"
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const eMail = watch("email");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (!verifyRecaptcha()) {
      toast.error("認証に失敗しました。");
      return;
    }

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.error) {
        if (callback.error === "reset") {
          setMode("reset");
          setResetReason("security");
          return;
        } else if (callback.error === "emailNotVerified") {
          setMode("mailVerify");
          return;
        } else {
          toast.error(callback.error);
          return;
        }
      }
      if (callback?.ok) {
        toast.success("Logged in");
        router.refresh();
        loginModal.onClose();
      }
    });
  };

  const sendResetMail = async () => {
    await axios.post("/api/reset_password", { email: eMail });
    toast.success("パスワード再設定メールを送信しました。");
  };

  const sendMailVerifyMail = async () => {
    await axios.post("/api/register/resend", { email: eMail });
    toast.success("認証メールを送信しました。");
  };

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const title = (
    <Heading
      title={
        <>
          <LogoMessage />
          <div className="w-full text-center">Login</div>
        </>
      }
    />
  );
  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <div className="w-full flex flex-row justify-end pt-1 pr-2 text-yt-text-gray hover:cursor-pointer hover:text-readine-green text-[13px]">
        <div
          onClick={() => {
            setMode("reset");
            setResetReason("forgetting");
          }}
        >
          Forgot your password?
        </div>
      </div>
    </div>
  );
  if (mode === "reset") {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Reset Password"
          subtitle={
            resetReason === "security"
              ? "セキュリティ対策のためパスワードの変更をお願いしております。"
              : "入力されたメールアドレスにパスワード再設定用リンクをお送りします。"
          }
        />
        {resetReason === "security" && (
          <div className="w-full text-center text-green-400 text-2xl font-semibold">
            {eMail}
          </div>
        )}
        {resetReason === "forgetting" && (
          <div>
            <Input
              id="email"
              label="Email"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        )}

        <div className="w-full flex justify-center">
          <div className="w-2/3">
            <Button
              label="パスワード再設定メール送信"
              onClick={sendResetMail}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div
            onClick={() => {
              setMode("default");
            }}
            className="text-yt-text-gray cursor-pointer hover:underline text-sm"
          >
            ログイン画面に戻る
          </div>
        </div>
      </div>
    );
  }
  if (mode === "mailVerify") {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Mail Verification"
          subtitle="メールアドレス認証が完了していません。"
        />
        <div className="w-full text-center text-green-400 text-2xl font-semibold">
          {eMail}
        </div>
        <div className="w-full flex justify-center">
          <div className="w-1/2">
            <Button label="認証メールの再送信" onClick={sendMailVerifyMail} />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div
            onClick={() => {
              setMode("default");
            }}
            className="text-yt-text-gray cursor-pointer hover:underline text-sm"
          >
            ログイン画面に戻る
          </div>
        </div>
      </div>
    );
  }
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>First time using Readine?</div>
          <div
            onClick={toggle}
            className="text-yt-white cursor-pointer hover:underline"
          >
            Create an account
          </div>
        </div>
      </div>
      <ReCaptchaBar />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title={title}
      actionLabel={mode === "reset" ? "パスワード再設定リンク送信" : "Continue"}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={mode === "reset" || mode === "mailVerify" ? null : footerContent}
    />
  );
};

export default LoginModal;
