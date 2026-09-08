import { cn } from "@/lib/utils";
import { SKILL_STATUS } from "@/data/skills";

/**
 * Compact skill chip/card used by the accessible fallback grid.
 */
export const SkillCard = ({ skill, active, onClick }) => {
    const status = SKILL_STATUS[skill.status] ?? SKILL_STATUS.EXPLORING;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "group text-left w-full rounded-xl border p-4 transition-all duration-300",
                "bg-card hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                    ? `ring-1 ${status.ring} border-primary/50`
                    : "border-border/50 hover:border-primary/30"
            )}
        >
            <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-sm">{skill.name}</span>
                <span className={cn("flex items-center gap-1 text-[10px] font-medium shrink-0 uppercase tracking-wide", status.color)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                    {status.label}
                </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {skill.description}
            </p>
        </button>
    );
};
