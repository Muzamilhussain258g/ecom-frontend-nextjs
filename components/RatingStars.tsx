import { Star } from "lucide-react"

interface RatingProps {
    rating: number
    size?:number
}

const RatingStars = ({ rating,
    size=20
 }: RatingProps) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {

                const fillPercentage = Math.min(
                    Math.max(rating - star + 1, 0),
                    1
                ) * 100

                return (
                    <div
                        key={star}
                        className="relative"
                        style={{
                            width: size,
                            height: size
                        }}
                    >
                        {/* Empty Star */}
                        <Star
                            size={size}
                            className="absolute text-[#FFD700]"
                        />

                        {/* Filled Portion */}
                        <div
                            className="absolute overflow-hidden"
                            style={{
                                width: `${fillPercentage}%`
                            }}
                        >
                            <Star
                                size={size}
                                fill="#FFD700"
                                color="#FFD700"
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default RatingStars