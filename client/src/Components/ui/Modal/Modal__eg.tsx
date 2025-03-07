import React, { useEffect } from "react";
// import ReactDOM from "react-dom"; // ^ для рендр.эл. вне корн.эл.React

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  body?: React.ReactNode;
  disableScroll?: boolean;
  closureBoundary?: boolean;
  rest?: string;
};

const Modal__eg: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  header,
  body,
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

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // ^ рендр.эл. вне корн.эл.React
  // return show ? ReactDOM.createPortal(<div>...</div>, document.body) : null;

  return isOpen ? (
    <div
      className="modal-overlay--eg"
      role="button"
      tabIndex={0}
      // ^ eslint copilot
      onClick={() => {
        if (!closureBoundary) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (!closureBoundary) {
            onClose();
          }
        }
      }}
    >
      <div className="modal-dialog--eg">
        <div
          className="modal-content--eg"
          role="button"
          tabIndex={0}
          onClick={handleModalClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleModalClick(e as unknown as React.MouseEvent);
            }
          }}
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
            <div className="modal-body--eg m-4" style={{ overflowY: "auto" }}>
              {body}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal__eg;
