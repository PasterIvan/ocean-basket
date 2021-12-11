interface Props {
  categories: any;
  basePath: string;
  onClose?: () => void;
}

const CategoryBadges = ({ onClose, categories, basePath }: Props) => {
  const handleClick = (path: string) => {
    // Router.push(path);
    if (onClose) {
      onClose();
    }
  };
  return (
    <div className="w-full mt-4 md:mt-6 pt-4 md:pt-6 flex flex-row items-start border-t border-border-200 border-opacity-60">
      <span className="text-sm font-semibold text-heading capitalize me-6 py-1">
        Категории
      </span>
      <div className="flex flex-row flex-wrap">
        {categories?.map((category: any) => (
          <button
            onClick={() => handleClick(`${basePath}?category=${category.slug}`)}
            key={category.id}
            className="transition-colors hover:border-accent hover:text-accent focus:outline-none focus:bg-opacity-100 lowercase text-sm text-heading tracking-wider whitespace-nowrap py-1 px-2.5 bg-transparent border border-border-200 rounded me-2 mb-2"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBadges;