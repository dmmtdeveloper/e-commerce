import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import sadShopping from "@/public/assets/animation/sad-shopping-mess.json";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import React, { useRef } from "react";


interface ConfirmationModalProps {
  message: string;
  title:string;
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  title,
}) => {
  const successRef = useRef<LottieRefCurrentProps>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-3xl">
      <div className="flex items-center justify-center">
          <Lottie
            onComplete={() => {
              successRef.current?.goToAndPlay(45, true);
            }}
            lottieRef={successRef}
            loop={false}
            className="w-64 h-auto"
            animationData={sadShopping}
          />
        </div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-sm">{message}</p>
        <div className="mt-4 flex justify-start gap-4">
          <ButtonCtaComponent onClick={onConfirm} className="bg-red-500 hover:bg-red-600 transition-all duration-300" text="Confirmar"/>
          <ButtonCtaComponent onClick={onCancel} className="bg-green-600 hover:bg-green-500" text="Cancelar"/>
      
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
