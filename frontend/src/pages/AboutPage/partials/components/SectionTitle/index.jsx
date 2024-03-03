import './style.scss'

const SectionTitle = ({ subtitle, title }) => {
  return (
    <>
      <h4 className="section-title__subtitle">{subtitle}</h4>
      <h2 className="section-title__title">{title}</h2>
    </>
  )
}

export default SectionTitle
