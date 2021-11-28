import { Category } from "../../../dishes/components/DishesContainer/DishesContainer";
import { StickySidebarListCategories } from "./StickySidebarListCategories";

type CategoriesProps = {
  className?: string;
  categories: Category[];
};

export function Categories({ className, categories }: CategoriesProps) {
  // const {
  //   data,
  //   isLoading: loading,
  //   error,
  // } = useCategoriesQuery({
  //   type: (query.pages?.[0] as string) ?? homePage?.slug,
  // });

  // if (error) return <ErrorMessage message={error.message} />;

  return (
    <StickySidebarListCategories
      notFound={false}
      categories={categories}
      loading={false}
      className={className}
    />
  );
}
