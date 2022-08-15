import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { splitCookie } from "../cookies";

export const loader = async ({ params, request }) => {
  const res = await fetch(`http://localhost:3000/splits/${params.splitId}`, {
    headers: {
      cookie: request.headers.get("cookie"),
    },
  });
  const j = await res.json();
  return json(j, { headers: res.headers });
};

export default function Split() {
  const data = useLoaderData();

  return <div>{JSON.stringify(data)}</div>;
}
