'use client';
import RequestTagPrint from "@/components/RequestTagPrint"
import { useParams } from "next/navigation";

export default function TagRequestPrint() {
  const {id} = useParams<{id:string}>();
  return (
    <RequestTagPrint id={id} />
  )
}
