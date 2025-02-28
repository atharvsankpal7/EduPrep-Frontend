"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-8 w-8",
              currentPage === 1 && "opacity-50 cursor-not-allowed"
            )}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </li>
        
        {pageNumbers.map((pageNumber, index) => (
          <li key={index}>
            {pageNumber === -1 || pageNumber === -2 ? (
              <span
                className="flex h-8 w-8 items-center justify-center"
                aria-hidden
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <button
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "h-8 w-8",
                  pageNumber === currentPage &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}
        
        <li>
          <button
            aria-label="Go to next page"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-8 w-8",
              currentPage === totalPages && "opacity-50 cursor-not-allowed"
            )}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}