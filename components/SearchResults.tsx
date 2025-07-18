import React from "react";
import { Car, Search, ExternalLink } from "lucide-react";

export type SearchResult = {
  title: string;
  link: string;
  thumbnail?: string;
};

type SearchResultsProps = {
  results: SearchResult[];
};

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results || results.length === 0) return null;
  return (
    <div className="mx-6 mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-slide-up flex-shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-green-800">Gevonden occasions:</h4>
      </div>
      <div className="space-y-2">
        {results.map((result, i) => (
          <a
            key={i}
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-green-50 transition-all duration-200 hover:shadow-md border border-green-100 group"
          >
            {result.thumbnail ? (
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-12 h-12 object-cover rounded-md flex-shrink-0 border border-gray-200"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 border border-gray-200 flex items-center justify-center text-green-400 text-xl">
                <Car />
              </div>
            )}
            <span className="text-gray-800 flex-1 text-sm line-clamp-2">
              {result.title}
            </span>
            <ExternalLink className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}
