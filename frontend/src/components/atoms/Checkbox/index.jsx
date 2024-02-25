import './style.scss'

const Checkbox = ({ value, checked, onChange }) => {
  return (
    <div className="checkbox">
      <label>
        <input
          className="checkbox__input"
          type="checkbox"
          value={value}
          checked={checked}
          onChange={onChange}
        />
        <span className="checkbox__span"></span>
        {value}
      </label>
    </div>
  )
}

export default Checkbox
