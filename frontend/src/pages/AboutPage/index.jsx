import './style.scss'
import TechnologySection from './partials/sections/TechnologySection'
import FeatureSection from './partials/sections/FeaturesSection'

const AboutPage = () => {
  return (
    <div className="about-page">
      <TechnologySection />
      <FeatureSection />
    </div>
  )
}

export default AboutPage
