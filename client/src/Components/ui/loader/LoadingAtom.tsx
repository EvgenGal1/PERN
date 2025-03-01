import { useEffect } from "react";

const LoadingAtom = () => {
  const styles = `
    .loading-atom {
      height: var(--height);
    }
    .loader {
      width: var(--width);
      height: var(--height);
      margin: 0 auto;
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
      animation: rotate-one 1s linear infinite;
      border-bottom: var(--load-atom) solid var(--act-dark);
    }
    .inner.two {
      animation: rotate-two 1s linear infinite;
      border-right: var(--load-atom) solid var(--act-dark);
    }
    .inner.three {
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

  // добав.stl ч/з usEf
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="loading-atom">
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
    </div>
  );
};

export default LoadingAtom;
