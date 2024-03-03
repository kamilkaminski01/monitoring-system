import './style.scss'
import FloatingIcons from '../../components/FloatingIcons'
import SectionTitle from '../../components/SectionTitle'

const TechnologySection = () => {
  return (
    <section className="technology-section">
      <div className="technology-section__wrapper">
        <SectionTitle subtitle="Monitoring System" title="Technology" />
        <p className="technology-section__description">
          The development of this web application relied on a versatile set of technologies and
          tools such as: Python, Django, JavaScript, React.js, Sass, Vite, PostgreSQL, AWS, Redis,
          Docker. Together, these technologies formed a comprehensive and cohesive tech stack,
          resulting in a feature-rich and user-friendly web application.
        </p>
      </div>
      <FloatingIcons />
    </section>
  )
}

export default TechnologySection
