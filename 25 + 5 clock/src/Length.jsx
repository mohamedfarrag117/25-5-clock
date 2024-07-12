const Length = ({ title, changeTime, type, time, formatTime }) => {
  return (
    <div>
      <h3>{title}</h3>
      <div className="time-set">
        <button
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3>{formatTime(time)}</h3>
        <button
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(+60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
};

export default Length;
