"use client";

import Modal from "./Modal";

import { usePathname, useRouter } from "next/navigation";
import Searchbar from "../Searcbar";
import useSearchModal from "@/hooks/modal/useSearchModal";
import LogoMessage from "../LogoMessage";
import { Interest, User } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import InterestList from "../InterestList";

interface SearchModalProps {
  currentUser: User | null;
}
const SearchModal: React.FC<SearchModalProps> = ({ currentUser }) => {
  const searchModal = useSearchModal();

  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    searchModal.onClose();
    router.push(pathname);
  };

  const [interestArray, setInterestArray] = useState<Interest[]>([]);

  useEffect(() => {
    if (!searchModal.isOpen) {
      //閉じているときに呼び出す
      axios
        .post(`/api/get/interests/random`, {
          num: 7,
        })
        .then((res) => setInterestArray(res.data));
    }
  }, [searchModal.isOpen]);

  useEffect(() => {
    if (searchModal.isOpen) {
      searchModal.onClose();
    }
  }, [pathname]); //Don't add searchModal to dependency array

  const bodyContent = (
    <div className="h-1/2 w-full flex flex-col justify-center items-center">
      <Searchbar modal />
    </div>
  );

  const footer = (
    <div className="w-full py-10 flex flex-col ">
      <LogoMessage />
      <div>
        <InterestList interestArray={interestArray} center />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={handleClose}
      onSubmit={() => {}}
      body={bodyContent}
      search
      footer={footer}
    />
  );
};

export default SearchModal;
