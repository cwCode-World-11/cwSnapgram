import { Button } from "./ui/button";

const Modal = ({ isOpen, setIsOpen, title, children }) => {
  return (
    isOpen && (
      <section className="bg-[#0e0e0eba] w-[100%] absolute z-100 flex-center top-[50%] left-[50%] translate-[-50%] md:w-[100%] h-screen">
        <div className="bg-[#151515] p-5 rounded-md z-50 w-fit custom-scrollbar">
          <div className="flex-center flex-col">
            {title && <h1 className="text-lg font-bold">Hello World</h1>}
            {children}
            <div className="flex justify-end w-full mt-2">
              <Button
                className="ml-2 text-[#bfbfbfee] border-1 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default Modal;
