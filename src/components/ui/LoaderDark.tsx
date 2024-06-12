import styles from "./loaderDark.module.css";

const Loader = () => {
  const lines = [];
  for (let i = 0; i < 3; i++) {
    lines.push(<div key={i} />);
  }

  return (
    <div className="justify-right flex h-full  items-center justify-center pl-2">
      <div className={styles["la-line-scale-pulse-out"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
