import { type Category } from "~/models/marketplace";

type CategoryPillsProps = {
  categories: Category[];
};

export function CategoryPills({ categories }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center gap-3 rounded-sm border border-purple-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-purple-200 bg-purple-50 text-base text-purple-600">
            {category.icon ?? "•"}
          </span>
          <div className="flex flex-col gap-1">
            <span>{category.name}</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-purple-400">lihat semua</span>
          </div>
        </div>
      ))}
    </div>
  );
}


