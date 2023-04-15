export const TitleEl = ({ text }: any) => {
  return (
    <span
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "initial",
        zIndex: "1",
      }}
    >
      {text}
    </span>
  );
};
//export {TitleEl}
