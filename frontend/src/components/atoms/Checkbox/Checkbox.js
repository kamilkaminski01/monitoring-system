import './Checkbox.scss';

const Checkbox = ({ value, checked, onChange }) => {
  return (
    <div className="checkbox-wrapper">
      <label>
        <input type="checkbox" value={value} checked={checked} onChange={onChange} />
        <span className="checkbox"></span>
        {value}
      </label>
    </div>
  );
};

export default Checkbox;
