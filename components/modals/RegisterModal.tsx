"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn, signOut } from "next-auth/react";

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import Modal from "./Modal";
import Heading from "../Heading";
import Button from "../Button";
import Input from "../Input";

import useRegisterModal from "@/hooks/modal/useRegisterModal";
import useLoginModal from "@/hooks/modal/useLoginModal";
import ReCaptchaBar from "./ReCaptchaBar";
import { divider } from "@uiw/react-md-editor";
import Logo from "../Logo";
import Link from "next/link";
import LogoMessage from "../LogoMessage";

interface RegisterModalProps {
  verifyRecaptcha: () => Promise<any>;
}
const RegisterModal: React.FC<RegisterModalProps> = ({ verifyRecaptcha }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [emailUnique, setEmailUnique] = useState(false);
  const [nameUnique, setNameUnique] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (!verifyRecaptcha()) {
      toast.error("認証に失敗しました。");
      setIsLoading(false);
      return;
    }

    if (data.password !== data.password_confirmation) {
      toast.error("パスワードが一致しません。");
      setIsLoading(false);
      return;
    }

    axios
      .post(`/api/register`, data)
      .then((res) => {
        if (res.data === "existing") {
          toast.error("このメールアドレスはすでに使用されています。");
          return;
        } else if (res.data === "ban") {
          toast.error("このメールアドレスは使用できません。");
          return;
        }
        toast.success(
          "認証用メールを送信しました。メールから登録を完了させて下さい。"
        );
        registerModal.onClose();
        // loginModal.onOpen();
      })
      .catch((error) => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

  const email = watch("email");
  const name = watch("name");

  useEffect(() => {
    const checkEmailDuplicated = async () => {
      if (!email) return;

      const res = await axios.post(`/api/auth/check_duplication`, {
        type: "email",
        value: email,
      });
      if (res.data === "Duplicated") {
        // toast.error("このメールアドレスはすでに使用されています。");
        setEmailUnique(false);
        setError("email", {
          type: "email_duplicated",
          message: "This email is already in use.",
        });
        return;
      }
      clearErrors("email");
      setEmailUnique(true);
    };

    checkEmailDuplicated();
  }, [clearErrors, email, setError, watch]);

  useEffect(() => {
    const checkNameDuplicated = async () => {
      if (!name) return;

      const res = await axios.post(`/api/auth/check_duplication`, {
        type: "name",
        value: name,
      });
      if (res.data === "Duplicated") {
        // toast.error("このメールアドレスはすでに使用されています。");
        setNameUnique(false);
        setError("name", {
          type: "name_duplicated",
          message: "This name is already in use.",
        });
        return;
      }
      clearErrors("name");
      setNameUnique(true);
    };

    checkNameDuplicated();
  }, [clearErrors, name, setError, watch]);

  const title = (
    <Heading
      title={
        <>
          <LogoMessage />
          <div className="w-full text-center">Create an account</div>
        </>
      }
      center
    />
  );
  const bodyContent = (
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
        id="name"
        label="UserName"
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
      <Input
        id="password_confirmation"
        type="password"
        label="Password_confirmation"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div className="w-full  text-yt-white flex items-start justify-center space-x-2">
        <div className="w-auto h-auto">
          <input
            id="agree_terms"
            type="checkbox"
            className="cursor-pointer scale-110"
            onChange={() => setTermsChecked(!termsChecked)}
            checked={termsChecked}
          />
        </div>

        <div className=" text-sm text-left">
          <label className="cursor-pointer" htmlFor="agree_terms">
            私はReadineの{" "}
          </label>
          <span
            className="mx-1 font-semibold text-readine-green  hover:text-yt-white underline cursor-pointer"
            onClick={() => window.open("/support/terms", "_blank")}
          >
            利用規約
          </span>
          と
          <span
            className="mx-1 font-semibold text-readine-green hover:text-yt-white underline cursor-pointer"
            onClick={() => window.open("/support/privacy", "_blank")}
          >
            プライバシーポリシー
          </span>
          <label className="cursor-pointer" htmlFor="agree_terms">
            に同意します。{" "}
          </label>
        </div>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
        disabled={!termsChecked}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
        disabled={!termsChecked}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>Already have an account?</div>
          <div
            onClick={toggle}
            className="text-readine-green font-semibold cursor-pointer hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
      <ReCaptchaBar />
    </div>
  );

  return (
    <Modal
      disabled={!termsChecked || !emailUnique}
      isOpen={registerModal.isOpen}
      title={title}
      actionLabel="登録"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
