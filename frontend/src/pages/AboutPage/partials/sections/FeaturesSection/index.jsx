import './style.scss'
import Box from '../../components/Box'
import SectionTitle from '../../components/SectionTitle'
import { BsPersonWorkspace, BsChat } from 'react-icons/bs'
import { GrGamepad } from 'react-icons/gr'

const boxes = [
  {
    icon: <BsPersonWorkspace />,
    title: 'Real-time monitoring',
    description:
      'Track players moves and observe live metrics of the games as they unfold. Manage the online rooms thanks to a dashboard.'
  },
  {
    icon: <BsChat />,
    title: 'Chats',
    description:
      'Get notified about a game action and communicate with players through an integrated chat without leaving the platform.'
  },
  {
    icon: <GrGamepad />,
    title: 'Online rooms',
    description:
      'Keep track and join online rooms effortlessly. Set your username and modify the room settings during creation.'
  }
]

const FeatureSection = () => {
  return (
    <section className="feature-section">
      <SectionTitle subtitle="Monitoring System" title="Features" />
      <div className="feature-section__boxes">
        {boxes.map((box, index) => (
          <Box key={index} icon={box.icon} title={box.title} description={box.description} />
        ))}
      </div>
    </section>
  )
}

export default FeatureSection
