import React, { useEffect } from "react";
// import ReactDOM from "react-dom"; // ^ для рендр.эл. вне корн.эл.React

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode | any;
  body?: React.ReactNode | any;
  disableScroll?: boolean;
  closureBoundary?: boolean;
  rest?: string;
};

const Modal__eg: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  header,
  body,
  disableScroll = true,
  closureBoundary,
  ...rest
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // ^ рендр.эл. вне корн.эл.React
  // return show ? ReactDOM.createPortal(<div>...</div>, document.body) : null;

  return isOpen
    ? ((disableScroll = true),
      closureBoundary,
      (
        <div
          className="modal-overlay--eg"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            closureBoundary
              ? ""
              : onClose(/* false // ? не понятно почему 0 аргум.приним.usSt */);
          }}
        >
          <div className="modal-dialog--eg">
            <div
              className="modal-content--eg"
              onClick={handleModalClick} /* {...rest} */
            >
              {header && (
                <>
                  <div className="modal-header--eg">
                    <>
                      <div className="modal-title--eg">{header}</div>
                      <button
                        onClick={() => onClose()}
                        type="button"
                        className="btn-cloce--eg"
                        aria-label="Close"
                      >
                        ✖
                      </button>
                    </>
                  </div>
                </>
              )}
              {body && (
                <div
                  className="modal-body--eg m-4"
                  style={{ overflowY: "auto" }}
                >
                  {body}
                </div>
              )}
            </div>
          </div>
        </div>
      ))
    : null;
};

export default Modal__eg;
