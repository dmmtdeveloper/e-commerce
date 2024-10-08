import Lottie, { LottieRefCurrentProps } from "lottie-react";
import sucessAnimation from "@/public/assets/animation/Animation-success.json";
import React, { useRef } from "react";
import ButtonModalClose from "../../button-modal/button-modal-close";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  const successRef = useRef<LottieRefCurrentProps>(null);
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
            animationData={sucessAnimation}
          />
        </div>
          <div className="flex flex-col pb-5">
            <h2 className="text-xl font-semibold">Éxito</h2>
            <p className="text-sm">{message}</p>
          </div>
      </div>
    </div>
  );
};

export default SuccessModal;
