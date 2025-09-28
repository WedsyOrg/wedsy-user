import styles from "./RangeSlider.module.css";

export default function RangeSlider({ range, setRange, factor = 1 }) {
  return (
    <div className={styles.rangeslider}>
      <input
        className={`${styles.min} ${styles.inputRange}`}
        type="range"
        min="1"
        max="100"
        value={Math.ceil(range[0] / factor)}
        onChange={(e) => {
          let value = parseInt(e.target.value) * factor;
          if (value < range[1]) {
            setRange([value, range[1]]);
          } else {
            setRange([range[1] - 1 * factor, range[1]]);
          }
        }}
      />
      <input
        className={`${styles.max} ${styles.inputRange}`}
        type="range"
        min="1"
        max="100"
        value={Math.ceil(range[1] / factor)}
        onChange={(e) => {
          let value = parseInt(e.target.value) * factor;
          if (value > range[0]) {
            setRange([range[0], value]);
          } else {
            setRange([range[0], range[0] + 1 * factor]);
          }
        }}
      />
      <span className={`${styles.range_min} ${styles.light} ${styles.left}`}>
        {Math.floor(range[0])}
      </span>
      <span className={`${styles.range_max} ${styles.light} ${styles.right}`}>
        {Math.floor(range[1])}
      </span>
    </div>
  );
}
