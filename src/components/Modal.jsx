import { useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";

const Modal = ({ isOpen, setIsOpen, title, children, showCloseBtn = true }) => {
  // useEffect(() => {
  //   if (isOpen) {
  //     window.scrollTo(0, 0);
  //   }
  // }, [isOpen]);

  if (!isOpen) return null; // ✅ guard

  return ReactDOM.createPortal(
    <section className="bg-[#0e0e0eba] fixed inset-0 z-[100] flex items-center justify-center">
      <div className="bg-[#151515] p-5 rounded-md z-50 w-fit max-h-screen overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center">
          {title && <h1 className="text-lg text-white">{title}</h1>}
          {children}
          <div className="flex justify-end w-full mt-2">
            {showCloseBtn && (
              <Button
                className="ml-2 text-[#bfbfbfee] border cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>,
    document.body
  );
};

export default Modal;
