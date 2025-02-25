import { useEffect } from "react";

const LoadingAtom = () => {
  const styles = `
    .loading-atom {
      height: var(--height);
    }
    .loader {
      position: absolute;
      // top: calc(50% - var(--height-btn));
      left: calc(50%  + (var(--width) / 2));
      width: var(--width);
      height: var(--height);
      border-radius: 50%;
      perspective: 800px;
      border-color: var(--TrafficRed);
    }
    .inner {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .inner.one {
      left: 0%;
      top: 0%;
      animation: rotate-one 1s linear infinite;
      border-bottom: var(--load-atom) solid var(--act-dark);
    }
    .inner.two {
      right: 0%;
      top: 0%;
      animation: rotate-two 1s linear infinite;
      border-right: var(--load-atom) solid var(--act-dark);
    }
    .inner.three {
      right: 0%;
      bottom: 0%;
      animation: rotate-three 1s linear infinite;
      border-top: var(--load-atom) solid var(--act-dark);
    }
    @keyframes rotate-one {
      0% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
      }
    }
    @keyframes rotate-two {
      0% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
      }
    }
    @keyframes rotate-three {
      0% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
      }
    }
  `;

  // Добавляем стили через useEffect
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  return (
    <div
      className="loading-atom"
      // style={{ width: "500px", height: "500px" }}
    >
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
    </div>
  );
};

export default LoadingAtom;
