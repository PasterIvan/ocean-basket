import { $categories } from "@features/choose-dishes/models";
import { getCategories } from "@shared/api/switchable";
import { createEffect, forward, restore } from "effector";
import { createGate, useStore } from "effector-react";
import { useGate } from "effector-react/effector-react.cjs";
import { useEffect, useState } from "react";
import { StickySidebarListCategories } from "./StickySidebarListCategories";

type CategoriesProps = {
  className?: string;
};

const categoriesGate = createGate();

export const fetchCategoriesFx = createEffect(getCategories);

forward({
  from: categoriesGate.open,
  to: [fetchCategoriesFx],
});

const $error = restore(fetchCategoriesFx.failData, null).map(Boolean);

export function Categories({ className }: CategoriesProps) {
  useGate(categoriesGate);

  const categories = useStore($categories);
  const isCategoriesLoading = useStore(fetchCategoriesFx.pending);
  const isError = useStore($error);

  if (isError) {
    return null;
  }

  return (
    <StickySidebarListCategories
      notFound={categories.length === 0}
      categories={categories!}
      loading={isCategoriesLoading}
      className={className}
    />
  );
}
