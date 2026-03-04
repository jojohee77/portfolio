interface Skill {
  id: string
  name: string
  icon: string
  category: 'coding' | 'design' | 'ai'
}

interface SkillIconProps {
  skill: Skill
}

export default function SkillIcon({ skill }: SkillIconProps) {
  return (
    <div className="flex flex-col items-start gap-3 sm:gap-4">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
        <img
          src={skill.icon}
          alt={skill.name}
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain"
          loading="lazy"
        />
      </div>
      <span className="text-[#e9e9e9] text-xs sm:text-sm text-left">
        {skill.name}
      </span>
    </div>
  )
}
