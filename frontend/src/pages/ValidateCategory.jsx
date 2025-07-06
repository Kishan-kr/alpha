import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Category from "./Category";
import { VALID_CATEGORIES } from "../constants/categories";

function ValidateCategory() {
  const { category } = useParams();

  const matched = useMemo(
    () => VALID_CATEGORIES.find(cat => cat.slug === category),
    [category]
  )

  if (!matched) {
    return <NotFound />;
  }

  return <Category info={matched} />;
}

export default ValidateCategory;