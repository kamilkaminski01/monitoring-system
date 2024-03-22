import './style.scss'
import Icon from '../Icon'
import Python from 'assets/icons/python.svg'
import Django from 'assets/icons/django.svg'
import JavaScript from 'assets/icons/javascript.svg'
import React from 'assets/icons/react.svg'
import Sass from 'assets/icons/sass.svg'
import Postgres from 'assets/icons/postgres.svg'
import Redis from 'assets/icons/redis.svg'
import Docker from 'assets/icons/docker.svg'
import AWS from 'assets/icons/aws.svg'
import Vite from 'assets/icons/vite.svg'

const icons = [
  { name: 'python', left: '15%', top: '15%', animationDelay: '0s', icon: Python },
  { name: 'django', left: '40%', top: '20%', animationDelay: '0.3s', icon: Django },
  { name: 'javascript', left: '10%', top: '50%', animationDelay: '1.5s', icon: JavaScript },
  { name: 'react', left: '65%', top: '20%', animationDelay: '0.7s', icon: React },
  { name: 'sass', left: '30%', top: '40%', animationDelay: '0.2s', icon: Sass },
  { name: 'vite', left: '40%', top: '60%', animationDelay: '0.8s', icon: Vite },
  { name: 'postgres', left: '55%', top: '40%', animationDelay: '1s', icon: Postgres },
  { name: 'redis', left: '20%', top: '70%', animationDelay: '0.4s', icon: Redis },
  { name: 'docker', left: '70%', top: '55%', animationDelay: '0s', icon: Docker },
  { name: 'aws', left: '55%', top: '75%', animationDelay: '0.6s', icon: AWS }
]

const FloatingIcons = () => {
  return (
    <div className="floating-icons">
      {icons.map((icon, index) => (
        <Icon
          key={index}
          name={icon.name}
          left={icon.left}
          top={icon.top}
          animationDelay={icon.animationDelay}
          icon={icon.icon}
        />
      ))}
    </div>
  )
}

export default FloatingIcons
