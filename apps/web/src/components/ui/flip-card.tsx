import { cn } from "../../lib/utils";
import { Code2, Copy, ExternalLink, Rocket, Zap } from "lucide-react";
import { useState } from "react";

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  color?: string;
  href?: string;
  icon?: React.ReactNode;
}

export default function CardFlip({
  title = "Project Name",
  subtitle = "A brief tagline for the project",
  description = "A longer description explaining what this project does and the problems it solves.",
  features = ["TypeScript", "React", "Cloudflare Workers", "Drizzle ORM"],
  color = "#27f576",
  href = "#",
  icon,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-72 w-64 sm:h-80 sm:w-72 lg:h-95 lg:w-80 [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]",
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(0deg)] [backface-visibility:hidden]",
            "overflow-hidden rounded-2xl",
            "bg-surface-container-low",
            "border border-outline-variant",
            "shadow-lg shadow-black/30",
            "transition-all duration-700",
            "group-hover:shadow-xl group-hover:shadow-black/50",
            isFlipped ? "opacity-0" : "opacity-100",
          )}
          style={{
            borderColor: isFlipped ? undefined : undefined,
          }}
        >
          {/* Accent gradient overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] transition-opacity duration-700 group-hover:opacity-[0.12]"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${color}, transparent 70%)`,
            }}
          />

          {/* Animated code blocks */}
          <div className="absolute inset-0 flex items-center justify-center pt-14">
            <div className="relative flex h-[110px] w-[210px] flex-col items-center justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded-sm opacity-0 animate-[slideIn_2s_ease-in-out_infinite]"
                  style={{
                    width: `${60 + ((i * 17) % 40)}%`,
                    animationDelay: `${i * 0.2}s`,
                    marginLeft: `${(i * 13) % 20}%`,
                    background: `linear-gradient(to right, ${color}25, ${color}40, ${color}25)`,
                  }}
                />
              ))}

              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl shadow-lg animate-pulse transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                    boxShadow: `0 8px 24px ${color}40`,
                  }}
                >
                  {icon ?? <Rocket className="h-7 w-7 text-background" />}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg leading-snug font-semibold tracking-tight text-on-surface transition-all duration-500 ease-out group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="line-clamp-2 text-sm tracking-tight text-on-surface-variant transition-all delay-[50ms] duration-500 ease-out group-hover:translate-y-[-4px]">
                  {subtitle}
                </p>
              </div>
              <div className="group/icon relative">
                <Zap
                  className="relative z-10 h-5 w-5 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12"
                  style={{ color }}
                />
              </div>
            </div>
          </div>

          {/* Hover border glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              boxShadow: `inset 0 0 0 1px ${color}30, 0 0 20px ${color}10`,
            }}
          />
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
            "rounded-2xl p-5",
            "bg-surface-container-low",
            "border border-outline-variant",
            "shadow-lg shadow-black/30",
            "flex flex-col",
            "transition-all duration-700",
            "group-hover:shadow-xl group-hover:shadow-black/50",
            !isFlipped ? "opacity-0" : "opacity-100",
          )}
        >
          {/* Accent gradient overlay */}
          <div
            className="absolute inset-0 rounded-2xl opacity-[0.06]"
            style={{
              background: `radial-gradient(ellipse at 70% 80%, ${color}, transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex-1 space-y-5">
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  }}
                >
                  <Code2 className="h-4 w-4 text-background" />
                </div>
                <h3 className="text-lg leading-snug font-semibold tracking-tight text-on-surface transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
                  {title}
                </h3>
              </div>
              <p className="line-clamp-3 text-sm leading-relaxed tracking-tight text-on-surface-variant transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
                {description}
              </p>
            </div>

            <div className="space-y-2.5">
              {features.map((feature, index) => {
                const icons = [Copy, Code2, Rocket, Zap];
                const IconComponent = icons[index % icons.length];

                return (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-on-surface-variant transition-all duration-500"
                    style={{
                      transform: isFlipped
                        ? "translateX(0)"
                        : "translateX(-10px)",
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <div
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${color}18` }}
                    >
                      <IconComponent className="h-3 w-3" style={{ color }} />
                    </div>
                    <span className="font-medium text-on-surface">
                      {feature}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-auto border-t border-outline-variant pt-4">
            <a
              href={href}
              className={cn(
                "group/start relative",
                "flex items-center justify-between",
                "rounded-lg p-2.5",
                "transition-all duration-300",
                "bg-surface-container-high",
                "hover:scale-[1.02] hover:cursor-pointer",
                "border border-transparent",
              )}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${color}18`;
                e.currentTarget.style.borderColor = `${color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <span className="text-sm font-semibold text-on-surface transition-colors duration-300">
                Ver Projeto
              </span>
              <ExternalLink
                className="relative z-10 h-4 w-4 transition-all duration-300 group-hover/start:translate-x-0.5"
                style={{ color }}
              />
            </a>
          </div>

          {/* Hover border glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              boxShadow: `inset 0 0 0 1px ${color}30, 0 0 20px ${color}10`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
