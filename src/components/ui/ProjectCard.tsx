import { Link } from 'react-router-dom'
import Badge from './Badge'

type ProjectCategory = 'Product' | 'WEB' | 'APP'
interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  thumbnail: string
  link?: string
  year: string
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const CardContent = (
    <article className="group flex flex-col rounded-3xl overflow-hidden cursor-pointer">
      {/* 이미지 영역 (높이 272px) */}
      <div className="relative w-full h-[272px] overflow-hidden rounded-3xl">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* 하단만 어둡게, 상단은 투명 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" aria-hidden />
        {/* 배지: 이미지 좌측 하단 */}
        <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5">
          <Badge label={project.category} />
        </div>
      </div>

      {/* 하단 텍스트 영역 (왼쪽 여백 없음) */}
      <div className="flex items-center justify-between gap-3 py-4 pr-4 pl-0 sm:py-5 sm:pr-5 md:py-6 md:pr-6 bg-transparent">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-0.5 sm:mb-1">
            {project.description}
          </p>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {project.title}
          </h3>
        </div>
        {project.link && (
          <img
            src="/images/icon-arrow.svg"
            alt=""
            className="w-[44px] h-auto flex-shrink-0 text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            aria-hidden
          />
        )}
      </div>
    </article>
  )

  if (project.link) {
    return <Link to={project.link}>{CardContent}</Link>
  }

  return CardContent
}
