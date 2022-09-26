import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const Split = () => {
  const [id, setId] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/splits", {
        method: "POST",
      });

      const json = await res.json();

      setId(json.id);
    })();
  }, []);

  if (id) {
    return <Navigate to={`/splits/${id}`} />;
  }

  return <div />;
};
