import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { splitCookie } from "../cookies";

export const loader = async () => {
  const res = await fetch("http://localhost:3000/splits", {
    method: "POST",
    credentials: "include",
  });

  console.log(res);

  const j = await res.json();

  return redirect(`/${j.id}`, { headers: res.headers });
};

export default function Index() {
  return null;
}
