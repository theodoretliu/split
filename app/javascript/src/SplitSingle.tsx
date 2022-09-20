import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SplitStore } from "src/stores/SplitStore";

export const SplitSingle = () => {
  const { id } = useParams();

  const [store] = useState(() => new SplitStore(id!));

  return <div />;
};
