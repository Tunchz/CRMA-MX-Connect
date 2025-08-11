import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return !dateString?null:new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
  }).format(date)
}

export const formatDatetime = (dateString: string) => {
  const date = new Date(dateString)
  return !dateString?null:new Intl.DateTimeFormat("th-TH", {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",

  }).format(date)
}
