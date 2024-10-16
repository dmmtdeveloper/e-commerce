import Lottie, { LottieRefCurrentProps } from "lottie-react";
import ErrorAnimation from "@/public/assets/animation/Error.json";
import React, { useRef } from "react";


interface CustomErrorModalProps {
  isOpen: boolean;
  message: string;
  title:string
  onClose: () => void;
}

const CustomErrorModal: React.FC<CustomErrorModalProps> = ({
  isOpen,
  message,
  title,
  onClose,
}) => {
  const successRef = useRef<LottieRefCurrentProps>(null);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-3xl flex-col">
        <div className="flex items-center justify-center">
          <Lottie
            onComplete={() => {
              successRef.current?.goToAndPlay(45, true);
            }}
            lottieRef={successRef}
            loop={false}
            className="w-52"
            animationData={ErrorAnimation}
          />
        </div>
          <div className="flex flex-col pb-5">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm">{message}</p>
          </div>
      </div>
    </div>
  );
};




export default CustomErrorModal;
