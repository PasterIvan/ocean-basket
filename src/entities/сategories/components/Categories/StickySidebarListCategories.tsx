import cn from "classnames";
import { NotFound } from "../../../dishes/components/NotFound";
import { Scrollbar } from "@shared/components/Scrollbar";
import { TreeMenu } from "../TreeMenu/TreeMenuItem";
import { CategoriesLoader } from "./CategoriesLoader";
import { Category } from "@shared/api/common";
import classNames from "classnames";

interface StickySidebarListCategoriesProps {
  notFound: boolean;
  loading: boolean;
  categories: Category[];
  className?: string;
}

export function StickySidebarListCategories({
  notFound,
  categories,
  loading,
  className,
}: StickySidebarListCategoriesProps) {
  if (loading) {
    return (
      <div className={classNames("hidden xl:block max-h-full", "pl-28")}>
        <div className="w-64 mt-8">
          <CategoriesLoader />
        </div>
      </div>
    );
  }
  return (
    <aside
      className={cn(
        `lg:sticky top-0 h-full xl:w-96 hidden xl:block bg-light`,
        className
      )}
    >
      <div className="max-h-full overflow-hidden">
        <Scrollbar
          className={classNames("max-h-screen", "pl-28")}
          style={{ height: "calc(100vh - 5.35rem)" }}
        >
          {!notFound ? (
            <div className="pr-5">
              <TreeMenu items={categories} className="xl:py-8" />
            </div>
          ) : (
            <div className="min-h-full w-full pt-6 pb-8 px-9 lg:p-8">
              <NotFound text="Нет категорий" className="h-96" />
            </div>
          )}
        </Scrollbar>
      </div>
    </aside>
  );
}
