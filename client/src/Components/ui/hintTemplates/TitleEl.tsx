export const TitleEl = ({ text }: { text: string }) => {
  return (
    <span
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        width: "inherit",
        textAlign: "center",
        fontSize: "initial",
        fontWeight: "500",
        zIndex: 1,
        top: "100%",
      }}
    >
      {text}
    </span>
  );
};
//export {TitleEl}
