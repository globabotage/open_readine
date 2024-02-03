"use client";

import Modal from "./Modal";
import { usePathname, useRouter } from "next/navigation";
import useMyInterestsModal from "@/hooks/modal/useMyInterestsModal";
import { Interest, User } from "@prisma/client";
import { AiFillMinusCircle } from "react-icons/ai";
import useInterest from "@/hooks/useInterest";
import { useEffect, useState } from "react";
import axios from "axios";

interface DeleteInterestProps {
  interestId: string;
  currentUser: User | null;
}

const RemoveInterest: React.FC<DeleteInterestProps> = ({
  currentUser,
  interestId,
}) => {
  const { toggleInterest } = useInterest({
    interestId,
    currentUser,
  });

  return (
    <AiFillMinusCircle
      onClick={toggleInterest}
      className="cursor-pointer text-readine-green hover:text-white"
    />
  );
};

interface MyInterestsModalProps {
  currentUser: User | null;
}
const MyInterestsModal: React.FC<MyInterestsModalProps> = ({ currentUser }) => {
  const myInterestsModal = useMyInterestsModal();

  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    myInterestsModal.onClose();
    router.push(pathname);
  };

  const [myInterestsArray, setMyInterestsArray] = useState<Interest[] | null>(
    null
  );

  useEffect(() => {
    axios.get(`/api/get/interests`).then((res) => {
      const MyInterestsArray = res.data.filter((interest: any) =>
        currentUser?.interestIds?.includes(interest.id)
      );
      setMyInterestsArray(MyInterestsArray);
    });
  }, [currentUser?.interestIds]);

  const bodyContent = (
    <div className="w-full flex space-x-2 text-lg">
      {myInterestsArray &&
        myInterestsArray.map((interest) => (
          <div
            key={interest.id}
            className="w-auto h-11 flex items-center px-2 py-2 rounded-lg text-white bg-transparent cursor-pointer border-2 shadow-md border-readine-green shadow-readine-green space-x-4"
          >
            <div>{interest.name}</div>
            <RemoveInterest
              currentUser={currentUser}
              interestId={interest.id}
            />
          </div>
        ))}
    </div>
  );

  return (
    <Modal
      isOpen={myInterestsModal.isOpen}
      onClose={handleClose}
      onSubmit={() => {}}
      body={bodyContent}
      middleOnMobile
    />
  );
};

export default MyInterestsModal;
