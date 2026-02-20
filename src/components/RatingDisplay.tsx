interface RatingDisplayProps {
  rating: number;
  max?: number;
}

export default function RatingDisplay({ rating, max = 10 }: RatingDisplayProps) {
  const percentage = (rating / max) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-900">
        {rating}/{max}
      </span>
      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-800 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
