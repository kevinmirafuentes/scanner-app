'use client';
import { useParams } from "next/navigation";

export default function Print() {
  const params = useParams<{ id: string }>();
  return (
    <>Print this {params.id}</>
  )
}